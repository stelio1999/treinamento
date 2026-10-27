<?php
// app/Mail/CredenciaisAcesso.php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CredenciaisAcesso extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $aluno, public string $senhaPlana) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'As tuas credenciais de acesso — FitClub',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.credenciais-acesso');
    }
}
