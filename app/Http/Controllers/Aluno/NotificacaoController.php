<?php
// app/Http/Controllers/Aluno/NotificacaoController.php

namespace App\Http\Controllers\Aluno;

use App\Http\Controllers\Controller;
use App\Models\Notificacao;
use App\Models\Solicitacao;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notificacoes = Notificacao::where('user_id', $user->id)
            ->where('tipo', '!=', 'mensagem')
            ->orderByDesc('created_at')
            ->paginate(30);

        // ✅ Lista de IDs de solicitações AINDA pendentes (para decidir se mostra botões)
        $pendentes = $user->isAdmin()
            ? Solicitacao::where('estado', 'pendente')->pluck('id')->all()
            : [];

        return Inertia::render('Aluno/Notificacoes', [
            'notificacoes' => $notificacoes,
            'pendentes'    => $pendentes,
        ]);
    }

    public function marcarLida(Notificacao $notificacao)
    {
        abort_unless($notificacao->user_id === auth()->id(), 403);
        $notificacao->update(['lida_em' => now()]);
        return back();
    }

    public function marcarTodasLidas()
    {
        Notificacao::where('user_id', auth()->id())
            ->where('tipo', '!=', 'mensagem')
            ->whereNull('lida_em')
            ->update(['lida_em' => now()]);

        return back();
    }
}
