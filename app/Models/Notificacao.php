<?php
// app/Models/Notificacao.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    use HasFactory;

    protected $table = 'notificacoes';

    protected $fillable = [
        'user_id', 'titulo', 'mensagem',
        'tipo', 'data', 'lida_em',
        'respondida_em', 'resposta',
    ];

    protected $casts = [
        'data' => 'array',
        'lida_em' => 'datetime',
        'respondida_em' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNaoLidas($q)
    {
        return $q->whereNull('lida_em');
    }

    public function getRespondidaAttribute(): bool
    {
        return ! is_null($this->respondida_em);
    }
}
