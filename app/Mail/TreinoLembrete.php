<?php
// app/Mail/TreinoLembrete.php

namespace App\Mail;

use App\Models\Treinamento;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TreinoLembrete extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Treinamento $treinamento,
        public User $aluno
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Lembrete: Treino em 30 minutos — {$this->treinamento->titulo}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.treino-lembrete',
        );
    }
}
