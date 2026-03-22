<?php

namespace App\Http\Controllers;

use App\Services\KabupatenService;
use App\Services\ProvinsiService;
use App\Http\Requests\StoreKabupatenRequest;
use App\Http\Requests\UpdateKabupatenRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class KabupatenController extends Controller
{
    public function __construct(
        protected KabupatenService $service,
        protected ProvinsiService $provinsiService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Kabupaten/Index', [
            'kabupaten' => $this->service->paginate($request->all()),
            'provinsis' => $this->provinsiService->getAll(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(int $id)
    {
        $kabupaten = $this->service->findById($id);
        $kabupaten->load('provinsi');

        return Inertia::render('Kabupaten/Show', [
            'kabupaten' => $kabupaten,
        ]);
    }

    public function store(StoreKabupatenRequest $request)
    {
        $this->service->create($request->validated());
        return back()->with('success', 'Kabupaten created successfully.');
    }

    public function update(UpdateKabupatenRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return back()->with('success', 'Kabupaten updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return back()->with('success', 'Kabupaten deleted successfully.');
    }
}
