<?php
// routes/web.php

use App\Http\Controllers\Admin\AlunoController;
use App\Http\Controllers\Admin\MensagemController;
use App\Http\Controllers\Admin\SolicitacaoController;
use App\Http\Controllers\Admin\TreinamentoController;
use App\Http\Controllers\Aluno\FeedController;
use App\Http\Controllers\Aluno\NotificacaoController;
use App\Http\Controllers\Aluno\PerfilController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PublicController;
use App\Models\Mensagem;
use App\Models\Treinamento;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\IaController;
use App\Http\Controllers\Aluno\ProgressoController;


Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->isAdmin()
            ? redirect('/admin/dashboard')
            : redirect('/feed');
    }
    return Inertia::render('Welcome');
})->name('welcome');


// ---------- Público ----------
Route::post('/solicitar-inscricao', [PublicController::class, 'solicitarInscricao'])
    ->name('public.solicitar');
Route::post('/contacto', [PublicController::class, 'contacto'])
    ->name('public.contacto');

// ---------- Auth ----------
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// ---------- Aluno ----------
Route::middleware('auth')->group(function () {
    Route::get('/feed', [FeedController::class, 'index'])->name('feed');
    Route::get('/feed/data', [FeedController::class, 'porData'])->name('feed.data');

    Route::get('/notificacoes', [NotificacaoController::class, 'index'])->name('notificacoes');
    Route::patch('/notificacoes/{notificacao}/lida', [NotificacaoController::class, 'marcarLida'])->name('notificacoes.lida');
    Route::patch('/notificacoes/todas-lidas', [NotificacaoController::class, 'marcarTodasLidas'])->name('notificacoes.todas');

    Route::get('/mensagens', [\App\Http\Controllers\ChatController::class, 'index'])->name('mensagens');
    Route::post('/mensagens', [\App\Http\Controllers\ChatController::class, 'enviar'])->name('mensagens.enviar');

    Route::get('/perfil', [PerfilController::class, 'show'])->name('perfil');
    Route::post('/perfil', [PerfilController::class, 'update'])->name('perfil.update');
    Route::post('/perfil/foto', [PerfilController::class, 'updateFoto'])->name('perfil.foto');
    Route::post('/perfil/senha', [PerfilController::class, 'updateSenha'])->name('perfil.senha');

    Route::get('/treino/{treinamento}', function (Treinamento $treinamento) {
    abort_unless(
        auth()->user()->isAdmin()
        || auth()->id() === $treinamento->aluno_id
        || $treinamento->tipo === 'publico',
        403
    );

    $treinamento->load('blocos');

    // Progressos do aluno para este treino
    $progressos = \App\Models\ProgressoBloco::where('user_id', auth()->id())
        ->where('treinamento_id', $treinamento->id)
        ->get()
        ->keyBy('bloco_id');

    return \Inertia\Inertia::render('Aluno/TreinoDetalhe', [
        'treino' => $treinamento,
        'progressos' => $progressos,
    ]);
})->name('treino.detalhe');

    Route::post('/progresso/toggle', [ProgressoController::class, 'toggle'])
        ->name('progresso.toggle');
    Route::post('/progresso/nota', [ProgressoController::class, 'nota'])
        ->name('progresso.nota');



        Route::get('/resultados', [ProgressoController::class, 'resultados'])->name('resultados');
Route::get('/resultados/{treinamento}', [ProgressoController::class, 'resultadoDetalhe'])
    ->name('resultados.detalhe');
});

// ---------- Admin ----------
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [TreinamentoController::class, 'index'])->name('dashboard');
    Route::get('/treinamentos/criar', [TreinamentoController::class, 'create'])->name('treinos.criar');
    Route::post('/treinamentos', [TreinamentoController::class, 'store'])->name('treinos.store');
    Route::get('/treinamentos/{treinamento}/editar', [TreinamentoController::class, 'edit'])->name('treinos.editar');
    Route::put('/treinamentos/{treinamento}', [TreinamentoController::class, 'update'])->name('treinos.update');
    Route::delete('/treinamentos/{treinamento}', [TreinamentoController::class, 'destroy'])->name('treinos.destroy');

    // ✅ Alunos
    Route::get('/alunos', [AlunoController::class, 'index'])->name('alunos.index');
    Route::put('/alunos/{aluno}', [AlunoController::class, 'update'])->name('alunos.update');
    Route::delete('/alunos/{aluno}', [AlunoController::class, 'destroy'])->name('alunos.destroy');
    Route::post('/alunos/{aluno}/resetar-senha', [AlunoController::class, 'resetarSenha'])->name('alunos.resetar');

    // ✅ Solicitações
    Route::get('/solicitacoes', [SolicitacaoController::class, 'index'])->name('solicitacoes.index');
    Route::post('/solicitacoes/{solicitacao}/aceitar', [SolicitacaoController::class, 'aceitar'])->name('solicitacoes.aceitar');
    Route::post('/solicitacoes/{solicitacao}/rejeitar', [SolicitacaoController::class, 'rejeitar'])->name('solicitacoes.rejeitar');

    Route::get('/mensagens/{aluno}', [\App\Http\Controllers\ChatController::class, 'comAluno'])
        ->whereNumber('aluno')->name('admin.mensagens.chat');
    Route::post('/mensagens', [MensagemController::class, 'store'])->name('mensagens.store');


    Route::post(
        '/notificacoes/{notificacao}/responder-contacto',
        [\App\Http\Controllers\Admin\ContactoRespostaController::class, 'responder']
    )
        ->name('admin.notificacoes.responder-contacto');


    Route::post('/ia/melhorar', [IaController::class, 'melhorar'])
        ->name('ia.melhorar');
});
