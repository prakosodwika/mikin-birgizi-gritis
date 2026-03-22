<?php

namespace App\Services;

use App\Repositories\Interfaces\SatuanPelayananPemenuhanGiziRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SatuanPelayananPemenuhanGiziService
{
    public function __construct(
        protected SatuanPelayananPemenuhanGiziRepositoryInterface $repository,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->repository->getAll($filters);
    }

    public function findById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Buat Satuan Pelayanan
            $satuanPelayanan = $this->repository->create([
                'name' => $data['name'],
                'address' => $data['address'],
                'contact_number' => $data['contact_number'] ?? null,
                'status' => $data['status'] ?? 'active',
                'provinsi_id' => $data['provinsi_id'] ?? null,
                'kabupaten_id' => $data['kabupaten_id'] ?? null,
                'kecamatan_id' => $data['kecamatan_id'] ?? null,
            ]);

            // 2. Buat User Operator Otomatis
            $this->userRepository->create([
                'name' => $data['admin_name'],
                'email' => $data['admin_email'],
                'password' => Hash::make($data['admin_password']),
                'role' => 'operator_satuan_pelayanan_pemenuhan_gizi',
                'satuan_pelayanan_pemenuhan_gizi_id' => $satuanPelayanan->id,
                'status' => 'active',
            ]);

            return $satuanPelayanan;
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(fn() => $this->repository->update($id, $data));
    }

    public function delete(int $id)
    {
        return DB::transaction(fn() => $this->repository->delete($id));
    }
}
