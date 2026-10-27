{{-- resources/views/emails/partials/logo.blade.php --}}
@php
    // Caminho físico do logo
    $logoPath = public_path('images/logo-email.png');

    // Se o ficheiro existir, codifica em base64 (funciona em todos os clientes)
    $logoSrc = null;
    if (file_exists($logoPath)) {
        $mime = mime_content_type($logoPath);
        $base64 = base64_encode(file_get_contents($logoPath));
        $logoSrc = "data:{$mime};base64,{$base64}";
    }
@endphp

<div style="text-align:center; padding: 24px 24px 8px 24px;">
    @if($logoSrc)
        {{-- Logo em base64: aparece sempre, mesmo com imagens bloqueadas --}}
        <img
            src="{{ $logoSrc }}"
            alt="FitClub Moçambique"
            width="160"
            style="display:inline-block; max-width:160px; height:auto; border:0; outline:none; text-decoration:none;"
        >
    @else
        {{-- Fallback: só texto se o ficheiro não existir --}}
        <span style="font-size:22px; font-weight:800; color:#0A2540; letter-spacing:1px;">
            FitClub <span style="color:#1E6F9F;">Moçambique</span>
        </span>
    @endif
</div>
