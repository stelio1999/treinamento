<?php
// app/Http/Controllers/Aluno/PerfilController.php

namespace App\Http\Controllers\Aluno;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PerfilController extends Controller
{
    /**
     * Mostra a página do perfil.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Aluno/Perfil', [
            'user' => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'telefone'  => $user->telefone,
                'role'      => $user->role,
                // acesso público à foto via storage:link
                'avatar'    => $user->avatar
                    ? asset('storage/' . $user->avatar)
                    : null,
            ],
        ]);
    }

    /**
     * Atualiza nome, e-mail e contacto.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'telefone' => ['nullable', 'string', 'max:30'],
        ], [
            'name.required'  => 'O nome é obrigatório.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email'    => 'Indica um e-mail válido.',
            'email.unique'   => 'Este e-mail já está registado.',
        ]);

        $user->update($data);

        return back()->with('success', 'Dados atualizados com sucesso.');
    }

    /**
     * Upload / troca da foto de perfil.
     */
    public function updateFoto(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'avatar.required' => 'Escolhe uma imagem.',
            'avatar.image'    => 'O ficheiro deve ser uma imagem.',
            'avatar.mimes'    => 'Formatos aceites: JPG, PNG, WEBP.',
            'avatar.max'      => 'A imagem não pode exceder 2 MB.',
        ]);

        $user = $request->user();

        // Apaga a foto antiga, se existir
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return back()->with('success', 'Foto de perfil atualizada.');
    }

    /**
     * Redefine a palavra-passe (exige a atual).
     */
    public function updateSenha(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Introduz a palavra-passe atual.',
            'password.required'         => 'Introduz a nova palavra-passe.',
            'password.min'              => 'A nova palavra-passe deve ter no mínimo 8 caracteres.',
            'password.confirmed'        => 'A confirmação não coincide.',
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'A palavra-passe atual está incorreta.',
            ]);
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return back()->with('success', 'Palavra-passe alterada com sucesso.');
    }
}
