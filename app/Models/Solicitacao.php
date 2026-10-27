<?php
// app/Models/Solicitacao.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{
    use HasFactory;

    protected $table = 'solicitacoes';

    protected $fillable = [
        'nome', 'email', 'telefone', 'tipo',
        'mensagem', 'estado', 'motivo_rejeicao', 'respondida_em',
    ];

    protected $casts = [
        'respondida_em' => 'datetime',
    ];

    public function scopePendentes($q)
    {
        return $q->where('estado', 'pendente');
    }
}
