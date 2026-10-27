<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'a@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Aluno Demo',
            'email' => 'aluno@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'aluno',
        ]);

        User::create([
            'name' => 'Aluno2 Demo2',
            'email' => 'aluno2@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'aluno',
        ]);
    }
}
