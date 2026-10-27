<?php
// app/Mail/TreinoCriado.php

namespace App\Mail;

use App\Models\Treinamento;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TreinoCriado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Treinamento $treinamento,
        public User $aluno
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Novo treino agendado — {$this->treinamento->titulo}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.treino-criado');
    }
}
