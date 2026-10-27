<?php
// app/Http/Controllers/Aluno/ProgressoController.php

namespace App\Http\Controllers\Aluno;

use App\Http\Controllers\Controller;
use App\Models\ProgressoBloco;
use App\Models\Treinamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressoController extends Controller
{
    /**
     * Marca/desmarca um bloco como concluído.
     * Cria o registo se não existir.
     */
    public function toggle(Request $request)
    {
        $data = $request->validate([
            'bloco_id' => ['required', 'exists:blocos_instrucao,id'],
            'concluido' => ['required', 'boolean'],
        ]);

        $user = $request->user();

        $bloco = \App\Models\BlocoInstrucao::findOrFail($data['bloco_id']);
        $treinamentoId = $bloco->treinamento_id;

        // Segurança: o aluno só pode marcar blocos de treinos que ele vê
        $treino = Treinamento::findOrFail($treinamentoId);
        abort_unless(
            $user->isAdmin()
            || $treino->tipo === 'publico'
            || $treino->aluno_id === $user->id,
            403
        );

        $progresso = ProgressoBloco::updateOrCreate(
            ['user_id' => $user->id, 'bloco_id' => $data['bloco_id']],
            [
                'treinamento_id' => $treinamentoId,
                'concluido' => $data['concluido'],
                'concluido_em' => $data['concluido'] ? now() : null,
            ]
        );

        return response()->json([
            'ok' => true,
            'progresso' => $progresso,
        ]);
    }

    /**
     * Guarda/atualiza a nota de um bloco.
     */
    public function nota(Request $request)
    {
        $data = $request->validate([
            'bloco_id' => ['required', 'exists:blocos_instrucao,id'],
            'nota' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $bloco = \App\Models\BlocoInstrucao::findOrFail($data['bloco_id']);
        $treino = Treinamento::findOrFail($bloco->treinamento_id);

        abort_unless(
            $user->isAdmin()
            || $treino->tipo === 'publico'
            || $treino->aluno_id === $user->id,
            403
        );

        $progresso = ProgressoBloco::updateOrCreate(
            ['user_id' => $user->id, 'bloco_id' => $data['bloco_id']],
            [
                'treinamento_id' => $bloco->treinamento_id,
                'nota' => $data['nota'],
            ]
        );

        return response()->json(['ok' => true, 'progresso' => $progresso]);
    }

    /**
     * Página "Resultados" — histórico com filtro por data.
     */
    public function resultados(Request $request)
    {
        $user = $request->user();
        $de  = $request->query('de');
        $ate = $request->query('ate');

        $query = ProgressoBloco::query()
            ->where('user_id', $user->id)
            ->where(function ($q) {
                $q->where('concluido', true)
                  ->orWhereNotNull('nota');
            })
            ->with('treinamento:id,titulo,data_hora,tipo,imagem_fundo');

        if ($de)  $query->whereDate('updated_at', '>=', $de);
        if ($ate) $query->whereDate('updated_at', '<=', $ate);

        // Agrupar por treinamento
        $agrupado = $query->get()->groupBy('treinamento_id');

        $treinos = $agrupado->map(function ($items, $treinamentoId) {
            $treino = $items->first()->treinamento;
            $totalBlocos = $treino->blocos()->count();
            $concluidos = $items->where('concluido', true)->count();
            $notas = $items->whereNotNull('nota')->where('nota', '!=', '')->count();

            return [
                'id' => $treino->id,
                'titulo' => $treino->titulo,
                'data_hora' => $treino->data_hora->toIso8601String(),
                'tipo' => $treino->tipo,
                'imagem_url' => $treino->imagem_url,
                'total_blocos' => $totalBlocos,
                'concluidos' => $concluidos,
                'notas' => $notas,
                'progresso_pct' => $totalBlocos === 0 ? 0 : round(($concluidos / $totalBlocos) * 100),
                'ultima_atividade' => $items->max('updated_at')?->toIso8601String(),
            ];
        })->sortByDesc('ultima_atividade')->values();

        return Inertia::render('Aluno/Resultados', [
            'treinos' => $treinos,
            'filtros' => ['de' => $de, 'ate' => $ate],
        ]);
    }

    /**
     * Detalhe de um treino — blocos concluídos e notas do aluno.
     */
    public function resultadoDetalhe(Request $request, Treinamento $treinamento)
    {
        $user = $request->user();

        abort_unless(
            $user->isAdmin()
            || $treinamento->tipo === 'publico'
            || $treinamento->aluno_id === $user->id,
            403
        );

        $treinamento->load('blocos');

        $progressos = ProgressoBloco::where('user_id', $user->id)
            ->where('treinamento_id', $treinamento->id)
            ->get()
            ->keyBy('bloco_id');

        $blocos = $treinamento->blocos->map(fn ($b) => [
            'id' => $b->id,
            'ordem' => $b->ordem,
            'conteudo' => $b->conteudo,
            'concluido' => $progressos[$b->id]->concluido ?? false,
            'nota' => $progressos[$b->id]->nota ?? null,
        ]);

        return Inertia::render('Aluno/ResultadoDetalhe', [
            'treino' => [
                'id' => $treinamento->id,
                'titulo' => $treinamento->titulo,
                'data_hora' => $treinamento->data_hora->toIso8601String(),
                'tipo' => $treinamento->tipo,
                'imagem_url' => $treinamento->imagem_url,
            ],
            'blocos' => $blocos,
        ]);
    }
}
