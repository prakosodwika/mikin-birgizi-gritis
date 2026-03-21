<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\SatuanPelayananPemenuhanGiziService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected SatuanPelayananPemenuhanGiziService $satuanPelayananPemenuhanGiziService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Users/Index', [
            'users' => $this->userService->getAll($request->all()),
            'satuan_pelayanan_pemenuhan_gizis' => $this->satuanPelayananPemenuhanGiziService->getAll(['per_page' => 100]),
            'filters' => $request->only(['search', 'role', 'status', 'satuan_pelayanan_pemenuhan_gizi_id']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->create($request->validated());
        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $this->userService->update($id, $request->validated());
        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->userService->delete($id);
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
