<?php
// app/Policies/TreinamentoPolicy.php

namespace App\Policies;

use App\Models\Treinamento;
use App\Models\User;

class TreinamentoPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function view(User $user, Treinamento $treinamento): bool
    {
        if ($treinamento->tipo === 'publico') {
            return true;
        }
        return $treinamento->aluno_id === $user->id;
    }

    public function update(User $user, Treinamento $treinamento): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Treinamento $treinamento): bool
    {
        return $user->isAdmin();
    }
}
