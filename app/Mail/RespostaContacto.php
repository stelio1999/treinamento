<?php
// app/Mail/RespostaContacto.php

namespace App\Mail;

use App\Models\Solicitacao;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RespostaContacto extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Solicitacao $solicitacao,
        public string $resposta
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Resposta ao teu contacto — FitClub',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.resposta-contacto');
    }
}
