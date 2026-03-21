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
        Schema::create('standar_gizis', function (Blueprint $table) {
            $table->id();
            $table->string('kelompok_usia')->unique(); // PAUD, SD, SMP, SMA, Ibu Hamil, Ibu Menyusui
            $table->decimal('kalori', 8, 2);
            $table->decimal('protein', 8, 2);
            $table->decimal('lemak', 8, 2);
            $table->decimal('karbohidrat', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standar_gizis');
    }
};
