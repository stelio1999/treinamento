<?php
// app/Models/BlocoInstrucao.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlocoInstrucao extends Model
{
    use HasFactory;

    protected $table = 'blocos_instrucao';

    protected $fillable = [
        'treinamento_id',
        'ordem',
        'conteudo',
        'video_url',   // ✅ novo
    ];

    public function treinamento()
    {
        return $this->belongsTo(Treinamento::class);
    }

    public function progressos()
    {
        return $this->hasMany(ProgressoBloco::class, 'bloco_id');
    }
}
