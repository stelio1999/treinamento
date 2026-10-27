<?php
// database/migrations/2025_01_01_000003_create_blocos_instrucao_table.php
// Cada linha = um parágrafo/bloco de instrução do treino (rich text HTML)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blocos_instrucao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treinamento_id')->constrained('treinamentos')->cascadeOnDelete();
            $table->unsignedInteger('ordem')->default(0);
            $table->longText('conteudo'); // HTML do editor rich text
            $table->timestamps();

            $table->index(['treinamento_id', 'ordem']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocos_instrucao');
    }
};
