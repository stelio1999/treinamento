<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar', 'telefone',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function treinosCriados()
    {
        return $this->hasMany(Treinamento::class, 'admin_id');
    }

    public function treinosPrivados()
    {
        return $this->hasMany(Treinamento::class, 'aluno_id');
    }

    public function mensagensRecebidas()
    {
        return $this->hasMany(Mensagem::class, 'aluno_id');
    }

    public function notificacoes()
    {
        return $this->hasMany(Notificacao::class);
    }

    public function progressoBlocos()
{
    return $this->hasMany(ProgressoBloco::class);
}

// app/Models/BlocoInstrucao.php — adicionar
public function progressos()
{
    return $this->hasMany(ProgressoBloco::class, 'bloco_id');
}
}
