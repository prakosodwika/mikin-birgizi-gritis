<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('provinsis', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('kabupatens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provinsi_id')->constrained('provinsis')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('kecamatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kabupaten_id')->constrained('kabupatens')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('kecamatans');
        Schema::dropIfExists('kabupatens');
        Schema::dropIfExists('provinsis');
    }
};
