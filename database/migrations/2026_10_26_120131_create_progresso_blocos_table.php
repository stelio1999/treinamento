<?php
// database/migrations/XXXX_XX_XX_XXXXXX_create_progresso_blocos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('progresso_blocos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('treinamento_id')->constrained('treinamentos')->cascadeOnDelete();
            $table->foreignId('bloco_id')->constrained('blocos_instrucao')->cascadeOnDelete();
            $table->boolean('concluido')->default(false);
            $table->text('nota')->nullable();
            $table->timestamp('concluido_em')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'bloco_id']);
            $table->index(['user_id', 'treinamento_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progresso_blocos');
    }
};
