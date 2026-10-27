<?php
// database/migrations/XXXX_XX_XX_XXXXXX_add_video_url_to_blocos_instrucao_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('blocos_instrucao', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('conteudo');
        });
    }

    public function down(): void
    {
        Schema::table('blocos_instrucao', function (Blueprint $table) {
            $table->dropColumn('video_url');
        });
    }
};
