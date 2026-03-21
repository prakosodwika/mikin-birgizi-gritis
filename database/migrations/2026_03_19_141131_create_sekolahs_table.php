<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sekolahs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->enum('level', ['PAUD', 'SD', 'SMP', 'SMA', 'SMK']);
            $table->integer('total_students')->default(0);
            $table->foreignId('kecamatan_id')->constrained('kecamatans');
            $table->foreignId('satuan_pelayanan_pemenuhan_gizi_id')->nullable()->constrained('satuan_pelayanan_pemenuhan_gizis')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sekolahs');
    }
};
