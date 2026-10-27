{{-- resources/views/emails/treino-lembrete.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Lembrete de Treino</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        @include('emails.partials.logo')

        @if($treinamento->imagem_fundo)
            <img src="{{ asset('storage/'.$treinamento->imagem_fundo) }}" alt="" style="width:100%; max-height:220px; object-fit:cover;">
        @endif

        <div style="padding:24px;">
            <h2 style="color:#0A2540; margin-top:0;">Olá, {{ $aluno->name }}!</h2>
            <p style="color:#333;">O teu treino começa em <strong>30 minutos</strong>:</p>
            <h3 style="color:#1E6F9F;">{{ $treinamento->titulo }}</h3>
            <p><strong>Data e hora:</strong> {{ $treinamento->data_hora->format('d/m/Y H:i') }}</p>
            <p><strong>Tipo:</strong> {{ ucfirst($treinamento->tipo) }}</p>
            <a href="{{ url('/feed') }}" style="display:inline-block; margin-top:16px; padding:12px 24px; background:#0A2540; color:#fff; text-decoration:none; border-radius:8px;">Ver treino</a>
        </div>
        @include('emails.partials.footer')
    </div>
</body>
</html>
