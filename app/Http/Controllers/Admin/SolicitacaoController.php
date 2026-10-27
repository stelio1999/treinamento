<?php
// app/Http/Controllers/Admin/SolicitacaoController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CredenciaisAcesso;
use App\Mail\SolicitacaoRejeitada;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\Notificacao;


class SolicitacaoController extends Controller
{
    public function index()
    {
        $solicitacoes = Solicitacao::orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Admin/Solicitacoes', ['solicitacoes' => $solicitacoes]);
    }

    public function aceitar(Solicitacao $solicitacao)
{
    abort_unless($solicitacao->tipo === 'inscricao', 422);
    if ($solicitacao->estado !== 'pendente') {
        return back()->with('error', 'Esta solicitação já foi respondida.');
    }
    if (User::where('email', $solicitacao->email)->exists()) {
        return back()->with('error', 'Já existe um utilizador com este e-mail.');
    }

    $senhaPlana = '12345678';

    $aluno = DB::transaction(function () use ($solicitacao, $senhaPlana) {
        $aluno = User::create([
            'name'     => $solicitacao->nome ?: explode('@', $solicitacao->email)[0],
            'email'    => $solicitacao->email,
            'telefone' => $solicitacao->telefone,
            'password' => Hash::make($senhaPlana),
            'role'     => 'aluno',
        ]);

        $solicitacao->update([
            'estado'        => 'aceite',
            'respondida_em' => now(),
        ]);

        // ✅ Marca as notificações ligadas a esta solicitação como respondidas
        Notificacao::where('tipo', 'solicitacao')
            ->where('data->solicitacao_id', $solicitacao->id)
            ->update([
                'respondida_em' => now(),
                'resposta'      => 'Aceite',
            ]);

        return $aluno;
    });

    Mail::to($aluno->email)->send(new CredenciaisAcesso($aluno, $senhaPlana));

    return back()->with('success', "Aluno criado. E-mail com credenciais enviado para {$aluno->email}.");
}

public function rejeitar(Request $request, Solicitacao $solicitacao)
{
    if ($solicitacao->estado !== 'pendente') {
        return back()->with('error', 'Esta solicitação já foi respondida.');
    }

    $data = $request->validate([
        'motivo_rejeicao' => ['nullable', 'string', 'max:500'],
    ]);

    $solicitacao->update([
        'estado'          => 'rejeitada',
        'motivo_rejeicao' => $data['motivo_rejeicao'] ?? null,
        'respondida_em'   => now(),
    ]);

    // ✅ Marca notificações
    Notificacao::where('tipo', 'solicitacao')
        ->where('data->solicitacao_id', $solicitacao->id)
        ->update([
            'respondida_em' => now(),
            'resposta'      => 'Rejeitada: ' . ($data['motivo_rejeicao'] ?? '—'),
        ]);

    Mail::to($solicitacao->email)->send(new SolicitacaoRejeitada($solicitacao));

    return back()->with('success', 'Solicitação rejeitada e e-mail enviado.');
}

}
