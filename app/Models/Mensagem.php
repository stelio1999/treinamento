<?php
// app/Models/Mensagem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensagem extends Model
{
    use HasFactory;

    protected $table = 'mensagens';

    protected $fillable = [
        'admin_id', 'aluno_id',
        'remetente_id', 'destinatario_id',
        'conteudo', 'lida', 'lida_em',
    ];

    protected $casts = [
        'lida' => 'boolean',
        'lida_em' => 'datetime',
    ];

    public function admin()    { return $this->belongsTo(User::class, 'admin_id'); }
    public function aluno()    { return $this->belongsTo(User::class, 'aluno_id'); }
    public function remetente()    { return $this->belongsTo(User::class, 'remetente_id'); }
    public function destinatario() { return $this->belongsTo(User::class, 'destinatario_id'); }
}
