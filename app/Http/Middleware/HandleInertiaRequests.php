<?php
// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use App\Models\Mensagem;
use App\Models\Notificacao;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'role'   => $user->role,
                    'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            // ✅ Contadores globais (badges) — calculados a cada request
            'contadores' => function () use ($user) {
                if (! $user) {
                    return ['mensagens' => 0, 'notificacoes' => 0];
                }

                return [
                    'mensagens' => Mensagem::where('destinatario_id', $user->id)
                        ->whereNull('lida_em')
                        ->count(),
                    'notificacoes' => Notificacao::where('user_id', $user->id)
                        ->whereNull('lida_em')
                        ->count(),
                ];
            },
        ]);
    }
}
