<?php
// app/Services/IaService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IaService
{
    public function melhorarTexto(string $texto): string
    {
        $apiKey = config('services.gemini.key');
        $model  = config('services.gemini.model', 'gemini-3.1-flash-lite');

        Log::info('[IA] Pedido recebido', ['model' => $model, 'has_key' => !empty($apiKey), 'len' => strlen($texto)]);

        if (! $apiKey) {
            Log::warning('[IA] GEMINI_API_KEY vazia');
            return $texto;
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
                'Content-Type'   => 'application/json',
            ])->timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => "És um treinador profissional. Melhora o texto do treino mantendo o formato de parágrafos. Devolve apenas o texto melhorado, sem explicações.\n\n" . $texto],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature'      => 0.5,
                    'maxOutputTokens'  => 4096,
                ],
            ]);

            Log::info('[IA] Resposta HTTP', ['status' => $response->status()]);

            if ($response->failed()) {
                Log::error('[IA] Falha na API', ['body' => $response->body()]);
                return $texto;
            }

            $melhorado = $response->json('candidates.0.content.parts.0.text');
            Log::info('[IA] Texto devolvido', ['len' => $melhorado ? strlen($melhorado) : 0]);

            return $melhorado ?: $texto;
        } catch (\Throwable $e) {
            Log::error('[IA] Exceção: ' . $e->getMessage());
            return $texto;
        }
    }
}
