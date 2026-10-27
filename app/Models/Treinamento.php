<?php
// app/Models/Treinamento.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treinamento extends Model
{
    use HasFactory;

    protected $table = 'treinamentos';

    protected $fillable = [
        'admin_id', 'aluno_id', 'titulo', 'descricao',
        'data_hora', 'tipo', 'imagem_fundo', 'lembrete_enviado',
    ];

    protected $casts = [
        'data_hora' => 'datetime',
        'lembrete_enviado' => 'boolean',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function aluno()
    {
        return $this->belongsTo(User::class, 'aluno_id');
    }

    public function blocos()
    {
        return $this->hasMany(BlocoInstrucao::class)->orderBy('ordem');
    }

    // Escopo: visíveis para um aluno (públicos + privados do próprio aluno)
    public function scopeVisiveisPara(Builder $query, User $user): Builder
    {
        return $query->where(function ($q) use ($user) {
            $q->where('tipo', 'publico')
              ->orWhere(function ($q2) use ($user) {
                  $q2->where('tipo', 'privado')->where('aluno_id', $user->id);
              });
        });
    }

    public function scopeDoDia(Builder $query, string $data): Builder
    {
        return $query->whereDate('data_hora', $data);
    }

    public function getImagemUrlAttribute(): ?string
    {
        return $this->imagem_fundo ? asset('storage/' . $this->imagem_fundo) : null;
    }

    protected $appends = ['imagem_url'];
}
