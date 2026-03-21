<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('satuan_pelayanan_pemenuhan_gizis', function (Blueprint $table) {
            $table->foreignId('provinsi_id')->nullable()->after('address')->constrained('provinsis')->nullOnDelete();
            $table->foreignId('kabupaten_id')->nullable()->after('provinsi_id')->constrained('kabupatens')->nullOnDelete();
            $table->foreignId('kecamatan_id')->nullable()->after('kabupaten_id')->constrained('kecamatans')->nullOnDelete();
            $table->timestamp('flagged_at')->nullable()->after('status');
            $table->text('flag_note')->nullable()->after('flagged_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('satuan_pelayanan_pemenuhan_gizis', function (Blueprint $table) {
            $table->dropForeign(['provinsi_id']);
            $table->dropForeign(['kabupaten_id']);
            $table->dropForeign(['kecamatan_id']);
            $table->dropColumn(['provinsi_id', 'kabupaten_id', 'kecamatan_id', 'flagged_at', 'flag_note']);
        });
    }
};
