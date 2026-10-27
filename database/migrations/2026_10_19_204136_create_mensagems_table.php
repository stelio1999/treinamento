<?php
// database/migrations/2025_01_01_000004_create_mensagens_table.php
// Mensagens enviadas pelo admin para um aluno específico

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mensagens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('aluno_id')->constrained('users')->cascadeOnDelete();
            $table->text('conteudo');
            $table->boolean('lida')->default(false);
            $table->timestamp('lida_em')->nullable();
            $table->timestamps();

            $table->index(['aluno_id', 'lida']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mensagens');
    }
};
