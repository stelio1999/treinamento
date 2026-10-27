<?php
// database/migrations/2025_01_01_000006_create_solicitacoes_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->index();
            $table->string('telefone')->nullable();
            $table->string('tipo')->default('inscricao'); // inscricao | contacto
            $table->text('mensagem')->nullable();
            $table->enum('estado', ['pendente', 'aceite', 'rejeitada'])->default('pendente');
            $table->text('motivo_rejeicao')->nullable();
            $table->timestamp('respondida_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};
