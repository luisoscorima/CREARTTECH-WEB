# Normaliza vendors y fuentes en todas las páginas HTML del sitio.
$root = Split-Path -Parent $PSScriptRoot
$optimizedFont = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;600;700&family=Raleway:wght@500;600;700&display=swap'
$swiperPages = @(
  'portfolio\portfolio-control-accesos.html',
  'portfolio\portfolio-ventas-pos.html',
  'portfolio\portfolio-parqueo.html',
  'portfolio\portfolio-inventario.html',
  'portfolio\portfolio-logistica.html',
  'portfolio\portfolio-restaurante.html',
  'portfolio-details.html'
)

$heavyFontRegex = [regex]'https://fonts\.googleapis\.com/css2\?family=Roboto:[^"]+'
$mediumFontRegex = [regex]'https://fonts\.googleapis\.com/css2\?family=Roboto:wght@[^"]+'

$removeCssPatterns = @(
  'animate\.css/animate\.min\.css',
  'glightbox/css/glightbox\.min\.css'
)
$removeJsPatterns = @(
  'glightbox/js/glightbox\.min\.js',
  'imagesloaded/imagesloaded\.pkgd\.min\.js',
  'isotope-layout/isotope\.pkgd\.min\.js'
)

Get-ChildItem -Path $root -Filter '*.html' -Recurse | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  $content = [IO.File]::ReadAllText($_.FullName)
  $original = $content
  $needsSwiper = $swiperPages -contains ($rel -replace '/', '\')

  $content = $heavyFontRegex.Replace($content, $optimizedFont)
  $content = $mediumFontRegex.Replace($content, $optimizedFont)

  foreach ($pattern in $removeCssPatterns) {
    $content = [regex]::Replace($content, "\s*<link[^>]+href=`"[^`"]*$pattern[^`"]*`"[^>]*>\s*", "`n")
  }
  foreach ($pattern in $removeJsPatterns) {
    $content = [regex]::Replace($content, "\s*<script[^>]+src=`"[^`"]*$pattern[^`"]*`"[^>]*></script>\s*", "`n")
  }

  if (-not $needsSwiper) {
    $content = [regex]::Replace($content, "\s*<link[^>]+href=`"[^`"]*swiper/swiper-bundle\.min\.css[^`"]*`"[^>]*>\s*", "`n")
    $content = [regex]::Replace($content, "\s*<script[^>]+src=`"[^`"]*swiper/swiper-bundle\.min\.js[^`"]*`"[^>]*></script>\s*", "`n")
  }

  $content = $content -replace 'href="\.\./assets/css/main\.css"', 'href="../assets/css/main.css?v=20250627"'
  $content = $content -replace 'href="assets/css/main\.css"', 'href="assets/css/main.css?v=20250627"'
  $content = $content -replace 'href="assets/css/main\.css\?v=20250626"', 'href="assets/css/main.css?v=20250627"'
  $content = $content -replace 'href="\.\./assets/css/main\.css\?v=20250626"', 'href="../assets/css/main.css?v=20250627"'

  if ($content -ne $original) {
    [IO.File]::WriteAllText($_.FullName, $content)
    Write-Host "Updated: $rel"
  }
}

Write-Host 'Done.'
