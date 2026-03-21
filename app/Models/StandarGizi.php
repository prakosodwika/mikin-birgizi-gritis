<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StandarGizi extends Model
{
    protected $fillable = [
        'kelompok_usia',
        'kalori',
        'protein',
        'lemak',
        'karbohidrat',
    ];

    protected $casts = [
        'kalori' => 'decimal:2',
        'protein' => 'decimal:2',
        'lemak' => 'decimal:2',
        'karbohidrat' => 'decimal:2',
    ];

    public function histories()
    {
        return $this->hasMany(StandarGiziHistory::class)->latest();
    }
}
