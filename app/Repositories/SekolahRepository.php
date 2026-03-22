<?php

namespace App\Repositories;

use App\Models\Sekolah;
use App\Repositories\Interfaces\SekolahRepositoryInterface;

class SekolahRepository implements SekolahRepositoryInterface
{
    public function paginate(array $filters = [])
    {
        return Sekolah::query()
            ->with(['kecamatan', 'satuanPelayananPemenuhanGizi'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('address', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['level'] ?? null, function ($query, $level) {
                $query->where('level', $level);
            })
            ->when($filters['satuan_pelayanan_pemenuhan_gizi_id'] ?? null, function ($query, $sppgId) {
                $query->where('satuan_pelayanan_pemenuhan_gizi_id', $sppgId);
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function getAll(array $with = [])
    {
        return Sekolah::with($with)->get();
    }

    public function findById(int $id, array $with = [])
    {
        return Sekolah::with($with)->findOrFail($id);
    }

    public function create(array $data)
    {
        return Sekolah::create($data);
    }

    public function update(int $id, array $data)
    {
        $sekolah = Sekolah::findOrFail($id);
        $sekolah->update($data);
        return $sekolah->fresh();
    }

    public function delete(int $id)
    {
        return Sekolah::destroy($id);
    }
}
