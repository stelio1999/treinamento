<?php
// app/Http/Controllers/IaController.php

namespace App\Http\Controllers;

use App\Services\IaService;
use Illuminate\Http\Request;

class IaController extends Controller
{
    public function __construct(private IaService $ia) {}

    public function melhorar(Request $request)
    {
        $data = $request->validate([
            'texto' => ['required', 'string', 'min:5', 'max:8000'],
        ]);

        $melhorado = $this->ia->melhorarTexto($data['texto']);

        return response()->json(['texto_melhorado' => $melhorado]);
    }
}
