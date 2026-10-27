<?php
// app/Http/Controllers/Aluno/FeedController.php

namespace App\Http\Controllers\Aluno;

use App\Http\Controllers\Controller;
use App\Models\Treinamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $treinosHoje = Treinamento::with('blocos')
            ->visiveisPara($user)
            ->doDia(now()->toDateString())
            ->orderBy('data_hora')
            ->get();

        return Inertia::render('Aluno/Feed', [
            'treinosHoje' => $treinosHoje,
            'dataSelecionada' => now()->toDateString(),
        ]);
    }

    public function porData(Request $request)
    {
        $request->validate(['data' => ['required', 'date']]);
        $user = $request->user();

        $treinos = Treinamento::with('blocos')
            ->visiveisPara($user)
            ->doDia($request->query('data'))
            ->orderBy('data_hora')
            ->get();

        return response()->json(['treinos' => $treinos]);
    }
}
