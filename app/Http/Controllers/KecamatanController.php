<?php

namespace App\Http\Controllers;

use App\Services\KecamatanService;
use App\Services\KabupatenService;
use App\Http\Requests\StoreKecamatanRequest;
use App\Http\Requests\UpdateKecamatanRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class KecamatanController extends Controller
{
    public function __construct(
        protected KecamatanService $service,
        protected KabupatenService $kabupatenService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Kecamatan/Index', [
            'kecamatan' => $this->service->getAll($request->all()),
            'kabupatens' => $this->kabupatenService->getAll(['per_page' => 100])['data'] ?? [],
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(int $id)
    {
        $kecamatan = $this->service->findById($id);
        $kecamatan->load('kabupaten.provinsi');

        return Inertia::render('Kecamatan/Show', [
            'kecamatan' => $kecamatan,
        ]);
    }

    public function store(StoreKecamatanRequest $request)
    {
        $this->service->create($request->validated());
        return back()->with('success', 'Kecamatan created successfully.');
    }

    public function update(UpdateKecamatanRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return back()->with('success', 'Kecamatan updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return back()->with('success', 'Kecamatan deleted successfully.');
    }
}
