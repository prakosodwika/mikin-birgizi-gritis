<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('user-management')
        ->name('users.')
        ->middleware(\App\Http\Middleware\EnsureUserIsBadanGiziNasional::class)
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\UserController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\UserController::class, 'store'])->name('store');
        Route::put('/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('standar-gizi')
        ->name('standar-gizi.')
        ->middleware(\App\Http\Middleware\EnsureUserIsBadanGiziNasional::class)
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\StandarGiziController::class, 'index'])->name('index');
        Route::put('/{id}', [\App\Http\Controllers\StandarGiziController::class, 'update'])->name('update');
        Route::get('/{id}/history', [\App\Http\Controllers\StandarGiziController::class, 'history'])->name('history');
    });

    Route::resource('satuan-pelayanan', \App\Http\Controllers\SatuanPelayananPemenuhanGiziController::class)
        ->parameters(['satuan-pelayanan' => 'id'])
        ->middleware(\App\Http\Middleware\EnsureUserIsBadanGiziNasional::class);
    Route::post('satuan-pelayanan/{id}/flag', [\App\Http\Controllers\SatuanPelayananPemenuhanGiziController::class, 'flag'])->name('satuan-pelayanan.flag')
        ->middleware(\App\Http\Middleware\EnsureUserIsBadanGiziNasional::class);
    Route::post('satuan-pelayanan/{id}/unflag', [\App\Http\Controllers\SatuanPelayananPemenuhanGiziController::class, 'unflag'])->name('satuan-pelayanan.unflag')
        ->middleware(\App\Http\Middleware\EnsureUserIsBadanGiziNasional::class);

    Route::prefix('provinsi')
        ->name('provinsi.')
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\ProvinsiController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\ProvinsiController::class, 'show'])->name('show');
        Route::post('/', [\App\Http\Controllers\ProvinsiController::class, 'store'])->name('store');
        Route::put('/{id}', [\App\Http\Controllers\ProvinsiController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\ProvinsiController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('kabupaten')
        ->name('kabupaten.')
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\KabupatenController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\KabupatenController::class, 'show'])->name('show');
        Route::post('/', [\App\Http\Controllers\KabupatenController::class, 'store'])->name('store');
        Route::put('/{id}', [\App\Http\Controllers\KabupatenController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\KabupatenController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('kecamatan')
        ->name('kecamatan.')
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\KecamatanController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\KecamatanController::class, 'show'])->name('show');
        Route::post('/', [\App\Http\Controllers\KecamatanController::class, 'store'])->name('store');
        Route::put('/{id}', [\App\Http\Controllers\KecamatanController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\KecamatanController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('sekolah')
        ->name('sekolah.')
        ->group(function () {
        Route::get('/', [\App\Http\Controllers\SekolahController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\SekolahController::class, 'show'])->name('show');
        Route::post('/', [\App\Http\Controllers\SekolahController::class, 'store'])->name('store');
        Route::put('/{id}', [\App\Http\Controllers\SekolahController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\SekolahController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('pengelola')
        ->name('pengelola.')
        ->middleware(\App\Http\Middleware\EnsureUserIsOperatorSatuanPelayananPemenuhanGizi::class)
        ->group(function () {
        Route::prefix('sekolah')
            ->name('sekolah.')
            ->group(function () {
            Route::get('/', [\App\Http\Controllers\SatuanPelayanan\SekolahController::class, 'index'])->name('index');
            Route::get('/{id}', [\App\Http\Controllers\SatuanPelayanan\SekolahController::class, 'show'])->name('show');
        });
    });
});

require __DIR__.'/settings.php';
