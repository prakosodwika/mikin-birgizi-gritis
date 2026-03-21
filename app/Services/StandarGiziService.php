<?php

namespace App\Services;

use App\Repositories\Interfaces\StandarGiziRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StandarGiziService
{
    public function __construct(
        protected StandarGiziRepositoryInterface $repository
    ) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function findById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $oldStandard = $this->repository->findById($id);
            
            // Prepare old values for history
            $oldValues = [
                'kalori' => $oldStandard->kalori,
                'protein' => $oldStandard->protein,
                'lemak' => $oldStandard->lemak,
                'karbohidrat' => $oldStandard->karbohidrat,
            ];

            // Update standard
            $newStandard = $this->repository->update($id, [
                'kalori' => $data['kalori'],
                'protein' => $data['protein'],
                'lemak' => $data['lemak'],
                'karbohidrat' => $data['karbohidrat'],
            ]);

            // Prepare new values for history
            $newValues = [
                'kalori' => $newStandard->kalori,
                'protein' => $newStandard->protein,
                'lemak' => $newStandard->lemak,
                'karbohidrat' => $newStandard->karbohidrat,
            ];

            // Create history record
            $this->repository->createHistory([
                'standar_gizi_id' => $id,
                'user_id' => Auth::id(),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'reason' => $data['reason'] ?? null,
                'created_at' => now(),
            ]);

            return $newStandard;
        });
    }

    public function getHistory(int $id)
    {
        return $this->repository->getHistory($id);
    }
}
