<?php

namespace App\Services;

use App\Repositories\Interfaces\SekolahRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SekolahService
{
    public function __construct(
        protected SekolahRepositoryInterface $repository
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
        return DB::transaction(fn() => $this->repository->create($data));
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
