<?php

namespace App\Repositories\Interfaces;

interface SekolahRepositoryInterface
{
    public function paginate(array $filters = []);
    public function getAll(array $with = []);
    public function findById(int $id, array $with = []);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
