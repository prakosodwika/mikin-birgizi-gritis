<?php

namespace App\Providers;

use App\Repositories\Interfaces\SatuanPelayananPemenuhanGiziRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\SatuanPelayananPemenuhanGiziRepository;
use App\Repositories\UserRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SatuanPelayananPemenuhanGiziRepositoryInterface::class, SatuanPelayananPemenuhanGiziRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProvinsiRepositoryInterface::class, \App\Repositories\ProvinsiRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\KabupatenRepositoryInterface::class, \App\Repositories\KabupatenRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\KecamatanRepositoryInterface::class, \App\Repositories\KecamatanRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\SekolahRepositoryInterface::class, \App\Repositories\SekolahRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\StandarGiziRepositoryInterface::class, \App\Repositories\StandarGiziRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ProgramGiziRepositoryInterface::class, \App\Repositories\ProgramGiziRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
