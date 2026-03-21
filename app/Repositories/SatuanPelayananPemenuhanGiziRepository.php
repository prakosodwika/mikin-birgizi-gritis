<?php

namespace App\Repositories;

use App\Models\SatuanPelayananPemenuhanGizi;
use App\Repositories\Interfaces\SatuanPelayananPemenuhanGiziRepositoryInterface;

class SatuanPelayananPemenuhanGiziRepository implements SatuanPelayananPemenuhanGiziRepositoryInterface
{
    public function getAll(array $filters = [])
    {
        return SatuanPelayananPemenuhanGizi::query()
            ->with(['provinsi', 'kabupaten', 'kecamatan'])
            ->when(isset($filters['search']), function ($query) use ($filters) {
                $query->where('name', 'like', "%{$filters['search']}%")
                      ->orWhere('address', 'like', "%{$filters['search']}%");
            })
            ->when(isset($filters['status']), function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->when(isset($filters['provinsi_id']), function ($query) use ($filters) {
                $query->where('provinsi_id', $filters['provinsi_id']);
            })
            ->when(isset($filters['kabupaten_id']), function ($query) use ($filters) {
                $query->where('kabupaten_id', $filters['kabupaten_id']);
            })
            ->when(isset($filters['is_flagged']), function ($query) use ($filters) {
                if ($filters['is_flagged'] === 'true') {
                    $query->whereNotNull('flagged_at');
                } elseif ($filters['is_flagged'] === 'false') {
                    $query->whereNull('flagged_at');
                }
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id)
    {
        return SatuanPelayananPemenuhanGizi::findOrFail($id);
    }

    public function create(array $data)
    {
        return SatuanPelayananPemenuhanGizi::create($data);
    }

    public function update(int $id, array $data)
    {
        $satuanPelayananPemenuhanGizi = $this->findById($id);
        $satuanPelayananPemenuhanGizi->update($data);
        return $satuanPelayananPemenuhanGizi->fresh();
    }

    public function delete(int $id)
    {
        return SatuanPelayananPemenuhanGizi::destroy($id);
    }
}
