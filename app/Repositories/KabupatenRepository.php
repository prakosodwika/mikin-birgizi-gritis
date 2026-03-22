<?php

namespace App\Repositories;

use App\Models\Kabupaten;
use App\Repositories\Interfaces\KabupatenRepositoryInterface;

class KabupatenRepository implements KabupatenRepositoryInterface
{
    public function paginate(array $filters = [])
    {
        return Kabupaten::query()
            ->with('provinsi')
            ->when(isset($filters['search']), function($q) use ($filters) {
                return $q->where('name', 'like', "%" . $filters['search'] . "%");
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function getAll(array $with = [])
    {
        return Kabupaten::with($with)->get();
    }

    public function findById(int $id, array $with = [])
    {
        return Kabupaten::with($with)->findOrFail($id);
    }

    public function create(array $data)
    {
        return Kabupaten::create($data);
    }

    public function update(int $id, array $data)
    {
        $kabupaten = Kabupaten::findOrFail($id);
        $kabupaten->update($data);
        return $kabupaten->fresh();
    }

    public function delete(int $id)
    {
        return Kabupaten::destroy($id);
    }
}
