{{-- resources/views/emails/solicitacao-recebida.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>Solicitação recebida</title></head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; padding:0; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        @include('emails.partials.logo')

        <div style="padding:0 24px 24px;">
            <h2 style="color:#0A2540;">Olá, {{ $solicitacao->nome }}!</h2>
            <p>A tua solicitação de inscrição no <strong>FitClub</strong> foi recebida com sucesso.</p>
            <p>Aguarda a aprovação do nosso administrador. Assim que formos aceites, receberás um novo e-mail com as tuas credenciais de acesso.</p>
            <p style="color:#888; font-size:12px;">Este é um e-mail automático — não respondas.</p>
        </div>
        @include('emails.partials.footer')
    </div>
</body>
</html>
