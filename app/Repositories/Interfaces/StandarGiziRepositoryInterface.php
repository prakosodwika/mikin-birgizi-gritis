<?php

namespace App\Repositories\Interfaces;

interface StandarGiziRepositoryInterface
{
    public function getAll();
    public function findById(int $id);
    public function update(int $id, array $data);
    public function getHistory(int $standarGiziId);
    public function createHistory(array $data);
}
