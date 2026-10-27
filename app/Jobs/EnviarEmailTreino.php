<?php
// app/Jobs/EnviarEmailTreino.php
// Envia e-mail de lembrete (30 min antes) para os destinatários corretos

namespace App\Jobs;

use App\Mail\TreinoLembrete;
use App\Models\Treinamento;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class EnviarEmailTreino implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(public Treinamento $treinamento) {}

    public function handle(): void
    {
        $cacheKey = "lembrete_treino_{$this->treinamento->id}";

        if (Cache::has($cacheKey)) {
            return;
        }

        $destinatarios = $this->treinamento->tipo === 'publico'
            ? User::where('role', 'aluno')->get()
            : User::where('id', $this->treinamento->aluno_id)->get();

        foreach ($destinatarios as $aluno) {
            Mail::to($aluno->email)->send(new TreinoLembrete($this->treinamento, $aluno));
        }

        $this->treinamento->update(['lembrete_enviado' => true]);
        Cache::put($cacheKey, true, now()->addHours(2));
    }
}
