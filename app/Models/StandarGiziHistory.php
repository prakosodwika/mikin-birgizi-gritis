<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StandarGiziHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'standar_gizi_id',
        'user_id',
        'old_values',
        'new_values',
        'reason',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
        'created_at' => 'datetime',
    ];

    public function standarGizi()
    {
        return $this->belongsTo(StandarGizi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
