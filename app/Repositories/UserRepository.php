<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function getAll(array $filters = [])
    {
        return User::query()
            ->with('satuanPelayananPemenuhanGizi')
            ->when(isset($filters['search']), function ($query) use ($filters) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', "%{$filters['search']}%")
                      ->orWhere('email', 'like', "%{$filters['search']}%");
                });
            })
            ->when(isset($filters['role']), function ($query) use ($filters) {
                $query->where('role', $filters['role']);
            })
            ->when(isset($filters['satuan_pelayanan_pemenuhan_gizi_id']), function ($query) use ($filters) {
                $query->where('satuan_pelayanan_pemenuhan_gizi_id', $filters['satuan_pelayanan_pemenuhan_gizi_id']);
            })
            ->when(isset($filters['status']), function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id)
    {
        return User::with('satuanPelayananPemenuhanGizi')->findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        $user = $this->findById($id);
        $user->update($data);
        return $user->fresh();
    }

    public function delete(int $id)
    {
        return User::destroy($id);
    }
}
