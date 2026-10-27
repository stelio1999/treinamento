{{-- resources/views/emails/resposta-contacto.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>Resposta ao teu contacto</title></head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        @include('emails.partials.logo')

        <div style="padding:24px;">
            <h2 style="color:#0A2540; margin-top:0;">Olá, {{ $solicitacao->nome }}!</h2>
            <p>Obrigado pelo teu contacto. Aqui está a nossa resposta:</p>
            <div style="background:#f0f6ff; border-left:4px solid #0A2540; padding:16px; border-radius:8px; margin:16px 0;">
                <p style="margin:0; white-space:pre-line;">{{ $resposta }}</p>
            </div>
            <p>A tua mensagem original:</p>
            <div style="background:#f9f9f9; padding:12px; border-radius:8px; color:#555;">
                <em>{{ $solicitacao->mensagem }}</em>
            </div>
            <p style="color:#888; font-size:12px; margin-top:20px;">FitClub Moçambique</p>
        </div>
        @include('emails.partials.footer')
    </div>
</body>
</html>
