{{-- resources/views/emails/credenciais-acesso.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Bem-vindo ao FitClub</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        @include('emails.partials.logo')

        <div style="padding:24px;">
            <h2 style="color:#0A2540; margin-top:0;">Bem-vindo ao FitClub, {{ $aluno->name }}!</h2>
            <p>A tua inscrição foi <strong>aprovada</strong>. Aqui estão as tuas credenciais de acesso:</p>

            <div style="background:#f0f6ff; border-left:4px solid #0A2540; padding:16px; border-radius:8px; margin:16px 0;">
                <p style="margin:4px 0;"><strong>E-mail:</strong> {{ $aluno->email }}</p>
                <p style="margin:4px 0;"><strong>Palavra-passe:</strong> {{ $senhaPlana }}</p>
            </div>

            <p>Recomendamos que alteres a palavra-passe após o primeiro login.</p>
            <a href="{{ url('/login') }}" style="display:inline-block; margin-top:8px; padding:12px 24px; background:#0A2540; color:#fff; text-decoration:none; border-radius:8px;">Entrar agora</a>
        </div>
    </div>
    @include('emails.partials.footer')
</body>
</html>
