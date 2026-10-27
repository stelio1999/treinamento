<?php
// app/Http/Controllers/Admin/AlunoController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AlunoController extends Controller
{
    public function index()
    {
        $alunos = User::where('role', 'aluno')
            ->orderBy('name')
            ->paginate(20)
            ->through(fn ($u) => [
                'id'       => $u->id,
                'name'     => $u->name,
                'email'    => $u->email,
                'telefone' => $u->telefone,
                'avatar'   => $u->avatar ? asset('storage/' . $u->avatar) : null,
                'criado'   => $u->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Admin/Alunos', ['alunos' => $alunos]);
    }

    public function update(Request $request, User $aluno)
    {
        abort_unless($aluno->role === 'aluno', 404);

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', Rule::unique('users', 'email')->ignore($aluno->id)],
            'telefone' => ['nullable', 'string', 'max:30'],
        ]);

        $aluno->update($data);

        return back()->with('success', 'Aluno atualizado.');
    }

    public function destroy(User $aluno)
    {
        abort_unless($aluno->role === 'aluno', 404);

        if ($aluno->avatar && Storage::disk('public')->exists($aluno->avatar)) {
            Storage::disk('public')->delete($aluno->avatar);
        }

        $aluno->delete();

        return back()->with('success', 'Aluno removido.');
    }

    public function resetarSenha(User $aluno)
    {
        abort_unless($aluno->role === 'aluno', 404);

        $aluno->update(['password' => Hash::make('12345678')]);

        return back()->with('success', 'Palavra-passe redefinida para 12345678.');
    }
}
