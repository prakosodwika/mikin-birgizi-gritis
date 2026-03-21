<?php

namespace App\Repositories;

use App\Models\Kecamatan;
use App\Repositories\Interfaces\KecamatanRepositoryInterface;

class KecamatanRepository implements KecamatanRepositoryInterface
{
    public function getAll(array $filters = [])
    {
        return Kecamatan::query()
            ->when(isset($filters['search']), function($q) use ($filters) {
                return $q->where('name', 'like', "%" . $filters['search'] . "%");
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id)
    {
        return Kecamatan::findOrFail($id);
    }

    public function create(array $data)
    {
        return Kecamatan::create($data);
    }

    public function update(int $id, array $data)
    {
        $kecamatan = Kecamatan::findOrFail($id);
        $kecamatan->update($data);
        return $kecamatan->fresh();
    }

    public function delete(int $id)
    {
        return Kecamatan::destroy($id);
    }
}
