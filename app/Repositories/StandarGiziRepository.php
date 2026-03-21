<?php

namespace App\Repositories;

use App\Models\StandarGizi;
use App\Models\StandarGiziHistory;
use App\Repositories\Interfaces\StandarGiziRepositoryInterface;

class StandarGiziRepository implements StandarGiziRepositoryInterface
{
    public function getAll()
    {
        return StandarGizi::all();
    }

    public function findById(int $id)
    {
        return StandarGizi::findOrFail($id);
    }

    public function update(int $id, array $data)
    {
        $standard = $this->findById($id);
        $standard->update($data);
        return $standard->fresh();
    }

    public function getHistory(int $standarGiziId)
    {
        return StandarGiziHistory::where('standar_gizi_id', $standarGiziId)
            ->with('user')
            ->latest()
            ->get();
    }

    public function createHistory(array $data)
    {
        return StandarGiziHistory::create($data);
    }
}
