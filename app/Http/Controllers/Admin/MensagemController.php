<?php
// app/Http/Controllers/Admin/MensagemController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mensagem;
use App\Models\Notificacao;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MensagemController extends Controller
{
    public function index()
    {
        $mensagens = Mensagem::with(['aluno:id,name', 'admin:id,name'])
            ->orderByDesc('created_at')
            ->paginate(30);

        return Inertia::render('Admin/Mensagens', [
            'mensagens' => $mensagens,
            'alunos' => User::where('role', 'aluno')->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'aluno_id' => ['required', 'exists:users,id'],
            'conteudo' => ['required', 'string', 'max:5000'],
        ]);

        Mensagem::create([
            'admin_id' => auth()->id(),
            'aluno_id' => $data['aluno_id'],
            'conteudo' => $data['conteudo'],
        ]);

        Notificacao::create([
            'user_id' => $data['aluno_id'],
            'titulo' => 'Nova mensagem do seu treinador',
            'mensagem' => \Str::limit($data['conteudo'], 80),
            'tipo' => 'mensagem',
        ]);

        return back()->with('success', 'Mensagem enviada!');
    }
}
