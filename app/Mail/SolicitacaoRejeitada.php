<?php
// app/Mail/SolicitacaoRejeitada.php

namespace App\Mail;

use App\Models\Solicitacao;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SolicitacaoRejeitada extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Solicitacao $solicitacao) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Sobre a tua inscrição — FitClub');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.solicitacao-rejeitada');
    }
}
