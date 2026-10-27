{{-- resources/views/emails/solicitacao-rejeitada.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>Solicitação rejeitada</title></head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        @include('emails.partials.logo')

        <div style="padding:24px;">
            <h2 style="color:#0A2540; margin-top:0;">Olá, {{ $solicitacao->nome }}</h2>
            <p>Infelizmente, a tua solicitação de inscrição não foi aceite neste momento.</p>
            @if($solicitacao->motivo_rejeicao)
                <p><strong>Motivo:</strong> {{ $solicitacao->motivo_rejeicao }}</p>
            @endif
            <p>Podes tentar novamente mais tarde.</p>
        </div>
        @include('emails.partials.footer')
    </div>
</body>
</html>
