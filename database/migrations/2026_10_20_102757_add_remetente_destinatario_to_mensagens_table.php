<?php
// database/migrations/2025_01_01_000007_add_remetente_destinatario_to_mensagens_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('mensagens', function (Blueprint $table) {
            $table->foreignId('remetente_id')->nullable()->after('id')
                ->constrained('users')->cascadeOnDelete();
            $table->foreignId('destinatario_id')->nullable()->after('remetente_id')
                ->constrained('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('mensagens', function (Blueprint $table) {
            $table->dropForeign(['remetente_id']);
            $table->dropForeign(['destinatario_id']);
            $table->dropColumn(['remetente_id', 'destinatario_id']);
        });
    }
};
