<?php
// app/Models/ProgressoBloco.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressoBloco extends Model
{
    use HasFactory;

    protected $table = 'progresso_blocos';

    protected $fillable = [
        'user_id', 'treinamento_id', 'bloco_id',
        'concluido', 'nota', 'concluido_em',
    ];

    protected $casts = [
        'concluido' => 'boolean',
        'concluido_em' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function treinamento() { return $this->belongsTo(Treinamento::class); }
    public function bloco() { return $this->belongsTo(BlocoInstrucao::class, 'bloco_id'); }
}
