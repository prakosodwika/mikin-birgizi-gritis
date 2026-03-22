<?php

namespace App\Services;

use App\Repositories\Interfaces\KabupatenRepositoryInterface;
use Illuminate\Support\Facades\DB;

class KabupatenService
{
    public function __construct(
        protected KabupatenRepositoryInterface $repository
    ) {}

    public function paginate(array $filters = [])
    {
        return $this->repository->paginate($filters);
    }

    public function getAll(array $with = [])
    {
        return $this->repository->getAll($with);
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
