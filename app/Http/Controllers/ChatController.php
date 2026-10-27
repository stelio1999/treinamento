<?php
// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Notificacao;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Lista de conversas.
     * - Admin vê a lista de alunos + últimas mensagens
     * - Aluno vê apenas a sua conversa com o admin
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $alunos = User::where('role', 'aluno')
                ->orderBy('name')
                ->get(['id', 'name', 'avatar']);

            // Última mensagem + não lidas por aluno
            $alunos = $alunos->map(function ($a) use ($user) {
                $ultima = Mensagem::where(function ($q) use ($a) {
                    $q->where('aluno_id', $a->id);
                })->orderByDesc('created_at')->first();

                $naoLidas = Mensagem::where('remetente_id', $a->id)
                    ->where('destinatario_id', $user->id)
                    ->whereNull('lida_em')
                    ->count();

                return [
                    'id'         => $a->id,
                    'name'       => $a->name,
                    'avatar'     => $a->avatar ? asset('storage/' . $a->avatar) : null,
                    'ultima'     => $ultima?->conteudo,
                    'ultima_em'  => $ultima?->created_at?->toIso8601String(),
                    'nao_lidas'  => $naoLidas,
                ];
            });

            return Inertia::render('Mensagens/Index', [
                'conversas'    => $alunos,
                'destinatario' => null,
                'mensagens'    => [],
            ]);
        }

        // Aluno → conversa única com o admin
        $admin = User::where('role', 'admin')->first();

        $mensagens = Mensagem::where(function ($q) use ($user, $admin) {
            $q->where('remetente_id', $user->id)->where('destinatario_id', $admin->id);
        })->orWhere(function ($q) use ($user, $admin) {
            $q->where('remetente_id', $admin->id)->where('destinatario_id', $user->id);
        })->orderBy('created_at')->get();

        // Marcar como lidas as que o admin me enviou
        Mensagem::where('destinatario_id', $user->id)
            ->whereNull('lida_em')->update(['lida' => true, 'lida_em' => now()]);

        return Inertia::render('Mensagens/Index', [
            'conversas'    => [],
            'destinatario' => [
                'id'   => $admin->id,
                'name' => $admin->name,
            ],
            'mensagens'    => $mensagens->map(fn ($m) => [
                'id'          => $m->id,
                'conteudo'    => $m->conteudo,
                'remetente_id'=> $m->remetente_id,
                'created_at'  => $m->created_at->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Abre a conversa com um aluno específico (só admin).
     */
    public function comAluno(Request $request, User $aluno)
    {
        abort_unless($request->user()->isAdmin(), 403);
        abort_unless($aluno->role === 'aluno', 404);

        $mensagens = Mensagem::where(function ($q) use ($aluno) {
            $q->where('aluno_id', $aluno->id);
        })->orderBy('created_at')->get();

        // Marcar como lidas
        Mensagem::where('aluno_id', $aluno->id)
            ->where('remetente_id', $aluno->id)
            ->whereNull('lida_em')->update(['lida' => true, 'lida_em' => now()]);

        return Inertia::render('Mensagens/Index', [
            'conversas'    => User::where('role', 'aluno')
                ->orderBy('name')->get(['id', 'name', 'avatar'])
                ->map(fn ($a) => [
                    'id'   => $a->id,
                    'name' => $a->name,
                    'avatar' => $a->avatar ? asset('storage/'.$a->avatar) : null,
                ]),
            'destinatario' => [
                'id'   => $aluno->id,
                'name' => $aluno->name,
            ],
            'mensagens'    => $mensagens->map(fn ($m) => [
                'id'          => $m->id,
                'conteudo'    => $m->conteudo,
                'remetente_id'=> $m->remetente_id,
                'created_at'  => $m->created_at->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Envia mensagem.
     * - Aluno envia para o admin
     * - Admin envia para um aluno específico
     */
    public function enviar(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'conteudo'       => ['required', 'string', 'max:5000'],
            'destinatario_id'=> ['required', 'exists:users,id'],
        ]);

        $destinatario = User::findOrFail($data['destinatario_id']);

        // Regras de negócio
        if ($user->isAdmin()) {
            abort_unless($destinatario->role === 'aluno', 422);
            $alunoId = $destinatario->id;
            $adminId = $user->id;
        } else {
            abort_unless($destinatario->isAdmin(), 422);
            $alunoId = $user->id;
            $adminId = $destinatario->id;
        }

        $mensagem = Mensagem::create([
            'admin_id'        => $adminId,
            'aluno_id'        => $alunoId,
            'remetente_id'    => $user->id,
            'destinatario_id' => $destinatario->id,
            'conteudo'        => $data['conteudo'],
        ]);

        // Notificar o destinatário
        Notificacao::create([
            'user_id'  => $destinatario->id,
            'titulo'   => 'Nova mensagem',
            'mensagem' => "De {$user->name}: " . \Str::limit($data['conteudo'], 80),
            'tipo'     => 'mensagem',
            'data'     => ['mensagem_id' => $mensagem->id],
        ]);

        return back();
    }
}
