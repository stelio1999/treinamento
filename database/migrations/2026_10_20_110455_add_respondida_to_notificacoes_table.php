<?php
// database/migrations/2025_01_01_000008_add_respondida_to_notificacoes_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notificacoes', function (Blueprint $table) {
            $table->timestamp('respondida_em')->nullable()->after('lida_em');
            $table->text('resposta')->nullable()->after('respondida_em');
        });
    }

    public function down(): void
    {
        Schema::table('notificacoes', function (Blueprint $table) {
            $table->dropColumn(['respondida_em', 'resposta']);
        });
    }
};
