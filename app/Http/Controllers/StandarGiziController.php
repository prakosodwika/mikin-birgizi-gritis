<?php

namespace App\Http\Controllers;

use App\Services\StandarGiziService;
use App\Http\Requests\UpdateStandarGiziRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StandarGiziController extends Controller
{
    public function __construct(
        protected StandarGiziService $service
    ) {}

    public function index()
    {
        return Inertia::render('StandarGizi/Index', [
            'standards' => $this->service->getAll(),
        ]);
    }

    public function update(UpdateStandarGiziRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return back()->with('success', 'Standar gizi berhasil diperbarui dan riwayat telah dicatat.');
    }

    public function history(int $id)
    {
        return Inertia::render('StandarGizi/History', [
            'standard' => $this->service->findById($id),
            'history' => $this->service->getHistory($id),
        ]);
    }
}
