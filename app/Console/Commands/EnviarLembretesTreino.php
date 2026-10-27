<?php
// app/Console/Commands/EnviarLembretesTreino.php
// Roda a cada minuto: busca treinos que começam em até 30 min e dispara jobs

namespace App\Console\Commands;

use App\Jobs\EnviarEmailTreino;
use App\Models\Treinamento;
use Illuminate\Console\Command;

class EnviarLembretesTreino extends Command
{
    protected $signature = 'treinos:lembretes';
    protected $description = 'Envia e-mails de lembrete para treinos que começam em 30 minutos';

    public function handle(): int
    {
        $agora = now();
        $limite = now()->addMinutes(30);

        $treinos = Treinamento::where('lembrete_enviado', false)
            ->whereBetween('data_hora', [$agora, $limite])
            ->get();

        foreach ($treinos as $treino) {
            EnviarEmailTreino::dispatch($treino);
            $this->info("Lembrete agendado: {$treino->titulo}");
        }

        $this->info("Total: {$treinos->count()} lembrete(s) disparado(s).");
        return self::SUCCESS;
    }
}
