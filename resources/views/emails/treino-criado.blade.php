{{-- resources/views/emails/treino-criado.blade.php --}}
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Novo treino agendado</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,.08);">
               @include('emails.partials.logo')

        @if($treinamento->imagem_fundo)
            <img src="{{ asset('storage/'.$treinamento->imagem_fundo) }}" alt="" style="width:100%; max-height:220px; object-fit:cover;">
        @endif
        <div style="padding:24px;">
            <h2 style="color:#0A2540; margin-top:0;">Olá, {{ $aluno->name }}!</h2>
            <p style="color:#333;">Foi agendado um <strong>novo treino</strong> para ti:</p>

            <h3 style="color:#1E6F9F; margin-bottom:4px;">{{ $treinamento->titulo }}</h3>
            <p style="margin:4px 0;"><strong>Data e hora:</strong> {{ $treinamento->data_hora->format('d/m/Y \à\s H:i') }}</p>
            <p style="margin:4px 0;"><strong>Tipo:</strong> {{ $treinamento->tipo === 'privado' ? 'Privado' : 'Público' }}</p>

            @if($treinamento->descricao)
                <p style="color:#555; margin-top:12px;">{{ $treinamento->descricao }}</p>
            @endif

            <a href="{{ url('/feed') }}" style="display:inline-block; margin-top:16px; padding:12px 24px; background:#0A2540; color:#fff; text-decoration:none; border-radius:8px;">Ver treino</a>

            <p style="color:#888; font-size:12px; margin-top:24px;">
                Receberás um lembrete 30 minutos antes do início.
            </p>
        </div>
        @include('emails.partials.footer')
    </div>
</body>
</html>
