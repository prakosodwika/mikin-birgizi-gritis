<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_gizis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('satuan_pelayanan_pemenuhan_gizi_id')
                ->constrained('satuan_pelayanan_pemenuhan_gizis')
                ->onDelete('cascade');
            $table->date('tanggal');
            $table->string('nama_program');
            $table->string('kelompok_usia'); // PAUD, SD, SMP, SMA, Ibu Hamil, Ibu Menyusui
            $table->text('catatan')->nullable();
            $table->integer('jumlah_porsi')->default(1);
            $table->enum('status_validasi', ['pending', 'valid', 'invalid'])->default('pending');
            // Auto-calculated totals (per porsi/serving)
            $table->decimal('kalori_total', 10, 2)->default(0);
            $table->decimal('protein_total', 10, 2)->default(0);
            $table->decimal('lemak_total', 10, 2)->default(0);
            $table->decimal('karbohidrat_total', 10, 2)->default(0);
            $table->decimal('harga_per_porsi', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_gizis');
    }
};
