<?php
// app/Http/Requests/StoreTreinamentoRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTreinamentoRequest extends FormRequest
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
        'data_hora' => ['required', 'date', 'after:now'],
        'tipo' => ['required', 'in:publico,privado'],
        'aluno_id' => ['required_if:tipo,privado', 'nullable', 'exists:users,id'],
        'imagem_fundo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        'blocos' => ['required', 'array', 'min:1'],
        'blocos.*.conteudo' => ['required', 'string'],
        'blocos.*.ordem' => ['nullable', 'integer'],
        'blocos.*.video_url' => ['nullable', 'string', 'url', 'max:500'],  // ✅
    ];
}

    public function messages(): array
    {
        return [
            'titulo.required' => 'O título é obrigatório.',
            'data_hora.after' => 'A data deve ser no futuro.',
            'aluno_id.required_if' => 'Selecione um aluno para treinos privados.',
            'blocos.required' => 'Adicione pelo menos um bloco de instrução.',
        ];
    }
}
