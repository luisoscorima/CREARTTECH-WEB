# Segunda pasada: defer en scripts, quitar validate.js donde no hay formulario, versionar main.js.
$root = Split-Path -Parent $PSScriptRoot
$fontBlock = @"
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;600;700&family=Raleway:wght@500;600;700&display=swap" rel="stylesheet">
"@

Get-ChildItem -Path $root -Filter '*.html' -Recurse | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  $content = [IO.File]::ReadAllText($_.FullName)
  $original = $content
  $isIndex = $rel -eq 'index.html'

  if (-not $isIndex) {
    $content = [regex]::Replace($content, "\s*<script[^>]+src=`"[^`"]*php-email-form/validate\.js[^`"]*`"[^>]*></script>\s*", "`n")
  }

  if ($content -notmatch 'fonts\.googleapis\.com/css2') {
    $content = [regex]::Replace($content, '(<link href="[^"]+/apple-touch-icon\.png" rel="apple-touch-icon">)', "`$1`n$fontBlock", 1)
    if ($content -notmatch 'fonts\.googleapis\.com/css2') {
      $content = [regex]::Replace($content, '(<meta name="robots"[^>]+>)', "`$1`n$fontBlock", 1)
    }
  }

  $content = $content -replace 'src="(\.\./)?assets/js/main\.js(\?v=[^"]+)?"', 'src="${1}assets/js/main.js?v=20250627"'
  $content = [regex]::Replace($content, '(<script\s+src="[^"]+")(></script>)', '$1 defer$2')
  $content = $content -replace '<script defer(\s+defer)+', '<script defer'
  $content = $content -replace 'portfolio-whatsapp-premium\.css"', 'portfolio-whatsapp-premium.css?v=20250627"'

  if ($content -ne $original) {
    [IO.File]::WriteAllText($_.FullName, $content)
    Write-Host "Patched: $rel"
  }
}

Write-Host 'Pass 2 done.'
