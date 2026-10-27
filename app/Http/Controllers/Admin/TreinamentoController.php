<?php
// app/Http/Controllers/Admin/TreinamentoController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTreinamentoRequest;
use App\Http\Requests\UpdateTreinamentoRequest;
use App\Models\Notificacao;
use App\Models\Treinamento;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\TreinoCriado;          // ✅ OBRIGATÓRIO
use App\Mail\TreinoLembrete;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TreinamentoController extends Controller
{
    public function index()
    {
        $treinos = Treinamento::with(['aluno:id,name', 'blocos'])
            ->orderByDesc('data_hora')
            ->paginate(15);

        return Inertia::render('Admin/Dashboard', [
            'treinos' => $treinos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CriarTreinamento', [
            'alunos' => User::where('role', 'aluno')->select('id', 'name')->get(),
        ]);
    }

    public function store(StoreTreinamentoRequest $request)
    {
        $data = $request->validated();

        $imagemPath = null;
        if ($request->hasFile('imagem_fundo')) {
            $imagemPath = $request->file('imagem_fundo')->store('treinos/capas', 'public');
        }

        $treino = DB::transaction(function () use ($data, $imagemPath) {
            $treino = Treinamento::create([
                'admin_id'      => auth()->id(),
                'aluno_id'      => $data['tipo'] === 'privado' ? $data['aluno_id'] : null,
                'titulo'        => $data['titulo'],
                'descricao'     => $data['descricao'] ?? null,
                'data_hora'     => $data['data_hora'],
                'tipo'          => $data['tipo'],
                'imagem_fundo'  => $imagemPath,
            ]);

            foreach ($data['blocos'] as $i => $bloco) {
                $treino->blocos()->create([
                    'ordem'     => $bloco['ordem'] ?? $i,
                    'conteudo'  => $bloco['conteudo'],
                    'video_url' => $bloco['video_url'] ?? null,   // ✅
                ]);
            }

            return $treino;
        });

        // ✅ Notificar destinatários (dentro da app)
        $destinatarios = $treino->tipo === 'publico'
            ? User::where('role', 'aluno')->get()
            : User::where('id', $treino->aluno_id)->get();

        foreach ($destinatarios as $aluno) {
            Notificacao::create([
                'user_id'  => $aluno->id,
                'titulo'   => 'Novo treino agendado',
                'mensagem' => $treino->titulo,
                'tipo'     => 'treino',
                'data'     => ['treinamento_id' => $treino->id],
            ]);
        }

        // ✅ Enviar e-mail de "Novo treino agendado" para cada destinatário
        //    Público → todos os alunos | Privado → só o aluno escolhido
        foreach ($destinatarios as $aluno) {
            try {
                Mail::to($aluno->email)->send(new TreinoCriado($treino, $aluno));
            } catch (\Throwable $e) {
                Log::error("Falha ao enviar e-mail de treino criado para {$aluno->email}: " . $e->getMessage());
            }
        }

        return redirect()->route('admin.dashboard')
            ->with('success', 'Treinamento criado com sucesso! E-mails enviados aos alunos.');
    }

    public function edit(Treinamento $treinamento)
    {
        $treinamento->load('blocos');
        return Inertia::render('Admin/EditarTreinamento', [
            'treinamento' => $treinamento,
            'alunos' => User::where('role', 'aluno')->select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateTreinamentoRequest $request, Treinamento $treinamento)
    {
        $data = $request->validated();

        if ($request->hasFile('imagem_fundo')) {
            if ($treinamento->imagem_fundo) {
                Storage::disk('public')->delete($treinamento->imagem_fundo);
            }
            $data['imagem_fundo'] = $request->file('imagem_fundo')->store('treinos/capas', 'public');
        }

        DB::transaction(function () use ($treinamento, $data) {
            $treinamento->update([
                'titulo' => $data['titulo'],
                'descricao' => $data['descricao'] ?? null,
                'data_hora' => $data['data_hora'],
                'tipo' => $data['tipo'],
                'aluno_id' => $data['tipo'] === 'privado' ? $data['aluno_id'] : null,
                'imagem_fundo' => $data['imagem_fundo'] ?? $treinamento->imagem_fundo,
                'lembrete_enviado' => false, // reset se data mudou
            ]);

            $treinamento->blocos()->delete();
            foreach ($data['blocos'] as $i => $bloco) {
                $treinamento->blocos()->create([
                    'ordem'     => $bloco['ordem'] ?? $i,
                    'conteudo'  => $bloco['conteudo'],
                    'video_url' => $bloco['video_url'] ?? null,   // ✅
                ]);
            }
        });

        return redirect()->route('admin.dashboard')
            ->with('success', 'Treinamento atualizado!');
    }

    public function destroy(Treinamento $treinamento)
    {
        if ($treinamento->imagem_fundo) {
            Storage::disk('public')->delete($treinamento->imagem_fundo);
        }
        $treinamento->delete();
        return back()->with('success', 'Treinamento removido.');
    }
}
