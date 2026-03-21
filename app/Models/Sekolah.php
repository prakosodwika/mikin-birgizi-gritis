<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sekolah extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'level',
        'total_students',
        'kecamatan_id',
        'satuan_pelayanan_pemenuhan_gizi_id',
    ];

    public function kecamatan(): BelongsTo
    {
        return $this->belongsTo(Kecamatan::class);
    }

    public function satuanPelayananPemenuhanGizi(): BelongsTo
    {
        return $this->belongsTo(SatuanPelayananPemenuhanGizi::class, 'satuan_pelayanan_pemenuhan_gizi_id');
    }
}
