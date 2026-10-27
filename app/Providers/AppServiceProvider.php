<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use App\Models\Treinamento;
use App\Policies\TreinamentoPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Gate::policy(Treinamento::class, TreinamentoPolicy::class);
    }
}
