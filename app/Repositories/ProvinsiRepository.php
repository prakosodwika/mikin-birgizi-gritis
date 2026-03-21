<?php

namespace App\Repositories;

use App\Models\Provinsi;
use App\Repositories\Interfaces\ProvinsiRepositoryInterface;

class ProvinsiRepository implements ProvinsiRepositoryInterface
{
    public function getAll(array $filters = [])
    {
        return Provinsi::query()
            ->when(isset($filters['search']), function($q) use ($filters) {
                return $q->where('name', 'like', "%" . $filters['search'] . "%");
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id)
    {
        return Provinsi::findOrFail($id);
    }

    public function create(array $data)
    {
        return Provinsi::create($data);
    }

    public function update(int $id, array $data)
    {
        $provinsi = Provinsi::findOrFail($id);
        $provinsi->update($data);
        return $provinsi->fresh();
    }

    public function delete(int $id)
    {
        return Provinsi::destroy($id);
    }
}
