<?php
// app/Http/Controllers/Admin/ContactoRespostaController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\RespostaContacto;
use App\Models\Notificacao;
use App\Models\Solicitacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactoRespostaController extends Controller
{
    public function responder(Request $request, Notificacao $notificacao)
    {
        abort_unless($request->user()->isAdmin(), 403);
        abort_unless($notificacao->tipo === 'contacto', 422);

        // Já respondida → impede duplicação
        if ($notificacao->respondida_em) {
            return back()->with('error', 'Esta notificação já foi respondida.');
        }

        $data = $request->validate([
            'resposta' => ['required', 'string', 'max:5000'],
        ], [
            'resposta.required' => 'Escreve a resposta antes de enviar.',
        ]);

        // O id da solicitação está no campo JSON `data`
        $solicitacaoId = $notificacao->data['solicitacao_id'] ?? null;
        $solicitacao = $solicitacaoId ? Solicitacao::find($solicitacaoId) : null;

        if (! $solicitacao) {
            return back()->with('error', 'Não foi possível encontrar a solicitação original.');
        }

        // 1) Envia e-mail ao remetente
        Mail::to($solicitacao->email)->send(new RespostaContacto($solicitacao, $data['resposta']));

        // 2) Marca esta notificação como respondida
        $notificacao->update([
            'respondida_em' => now(),
            'resposta'      => $data['resposta'],
            'lida_em'       => $notificacao->lida_em ?? now(),
        ]);

        // 3) Cria uma notificação "contacto respondido" (histórico)
        Notificacao::create([
            'user_id'  => $request->user()->id,
            'titulo'   => 'Contacto respondido',
            'mensagem' => "Respondeste a {$solicitacao->email}: " . \Str::limit($data['resposta'], 80),
            'tipo'     => 'contacto_respondido',
            'data'     => [
                'solicitacao_id' => $solicitacao->id,
                'notificacao_original_id' => $notificacao->id,
            ],
        ]);

        return back()->with('success', 'Resposta enviada por e-mail.');
    }
}
