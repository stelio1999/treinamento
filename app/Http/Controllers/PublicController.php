<?php
// app/Http/Controllers/PublicController.php

namespace App\Http\Controllers;

use App\Mail\ContactoRecebido;
use App\Mail\SolicitacaoRecebida;
use App\Models\Notificacao;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PublicController extends Controller
{
    /** POST /solicitar-inscricao */
    public function solicitarInscricao(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ], [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email'    => 'Indica um e-mail válido.',
        ]);

        // Se já existe utilizador com este e-mail, não cria solicitação duplicada
        if (User::where('email', $data['email'])->exists()) {
            return back()->with('error', 'Este e-mail já está registado. Faz login.');
        }

        // Evita solicitações duplicadas pendentes
        $existente = Solicitacao::where('email', $data['email'])
            ->where('tipo', 'inscricao')
            ->where('estado', 'pendente')
            ->first();

        if ($existente) {
            return back()->with('error', 'Já tens uma solicitação pendente com este e-mail.');
        }

        $solicitacao = Solicitacao::create([
            'nome'  => explode('@', $data['email'])[0],
            'email' => $data['email'],
            'tipo'  => 'inscricao',
            'estado'=> 'pendente',
        ]);

        // E-mail de confirmação para o candidato
        Mail::to($solicitacao->email)->send(new SolicitacaoRecebida($solicitacao));

        // Notificação para todos os admins
        foreach (User::where('role', 'admin')->get() as $admin) {
            Notificacao::create([
                'user_id'  => $admin->id,
                'titulo'   => 'Nova solicitação de inscrição',
                'mensagem' => "O e-mail {$solicitacao->email} pediu para se inscrever.",
                'tipo'     => 'solicitacao',
                'data'     => ['solicitacao_id' => $solicitacao->id],
            ]);
        }

        return back()->with('success', 'Solicitação enviada! Verifica o teu e-mail.');
    }

    /** POST /contacto */
    public function contacto(Request $request)
    {
        $data = $request->validate([
            'nome'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255'],
            'telefone' => ['nullable', 'string', 'max:30'],
            'mensagem' => ['required', 'string', 'max:5000'],
        ], [
            'nome.required'     => 'O nome é obrigatório.',
            'email.required'    => 'O e-mail é obrigatório.',
            'email.email'       => 'Indica um e-mail válido.',
            'mensagem.required' => 'A mensagem é obrigatória.',
        ]);

        $solicitacao = Solicitacao::create([
            'nome'     => $data['nome'],
            'email'    => $data['email'],
            'telefone' => $data['telefone'] ?? null,
            'mensagem' => $data['mensagem'],
            'tipo'     => 'contacto',
            'estado'   => 'pendente',
        ]);

        Mail::to($solicitacao->email)->send(new ContactoRecebido($solicitacao));

        foreach (User::where('role', 'admin')->get() as $admin) {
            Notificacao::create([
                'user_id'  => $admin->id,
                'titulo'   => 'Novo contacto recebido',
                'mensagem' => "{$solicitacao->nome} ({$solicitacao->email}): " . \Str::limit($solicitacao->mensagem, 80),
                'tipo'     => 'contacto',
                'data'     => ['solicitacao_id' => $solicitacao->id],
            ]);
        }

        return back()->with('success', 'Mensagem enviada! Vamos responder em breve.');
    }
}
