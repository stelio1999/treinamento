<?php
// app/Http/Requests/UpdateTreinamentoRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTreinamentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
            'data_hora' => ['required', 'date'],
            'tipo' => ['required', 'in:publico,privado'],
            'aluno_id' => ['required_if:tipo,privado', 'nullable', 'exists:users,id'],
            'imagem_fundo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'blocos' => ['required', 'array', 'min:1'],
            'blocos.*.conteudo' => ['required', 'string'],
        ];
    }
}
