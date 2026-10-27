<?php
// database/migrations/2025_01_01_000002_create_treinamentos_table.php
// Tabela principal de treinamentos (públicos ou privados)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('treinamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('aluno_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->dateTime('data_hora');
            $table->enum('tipo', ['publico', 'privado'])->default('publico');
            $table->string('imagem_fundo')->nullable();
            $table->boolean('lembrete_enviado')->default(false);
            $table->timestamps();

            $table->index(['data_hora', 'tipo']);
            $table->index('aluno_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treinamentos');
    }
};
