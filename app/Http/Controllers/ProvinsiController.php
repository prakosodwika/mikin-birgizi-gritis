<?php

namespace App\Http\Controllers;

use App\Services\ProvinsiService;
use App\Http\Requests\StoreProvinsiRequest;
use App\Http\Requests\UpdateProvinsiRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProvinsiController extends Controller
{
    public function __construct(protected ProvinsiService $service) {}

    public function index(Request $request)
    {
        return Inertia::render('Provinsi/Index', [
            'provinsi' => $this->service->getAll($request->all()),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(int $id)
    {
        return Inertia::render('Provinsi/Show', [
            'provinsi' => $this->service->findById($id),
        ]);
    }

    public function store(StoreProvinsiRequest $request)
    {
        $this->service->create($request->validated());
        return back()->with('success', 'Provinsi created successfully.');
    }

    public function update(UpdateProvinsiRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return back()->with('success', 'Provinsi updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return back()->with('success', 'Provinsi deleted successfully.');
    }
}
