<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_gizi_bahans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_gizi_id')
                ->constrained('program_gizis')
                ->onDelete('cascade');
            $table->string('nama_bahan');         // e.g., "Beras", "Dada Ayam"
            $table->string('satuan');             // gram, ml, buah, sdm
            $table->decimal('jumlah', 10, 2);     // quantity per batch
            // Nutritional values per 100g/ml of this ingredient
            $table->decimal('kalori_per_100g', 8, 2)->default(0);
            $table->decimal('protein_per_100g', 8, 2)->default(0);
            $table->decimal('lemak_per_100g', 8, 2)->default(0);
            $table->decimal('karbohidrat_per_100g', 8, 2)->default(0);
            // Pricing
            $table->decimal('harga_per_satuan', 12, 2)->default(0); // price per unit (gram/ml/buah)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_gizi_bahans');
    }
};
