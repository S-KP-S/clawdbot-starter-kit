$ErrorActionPreference = 'SilentlyContinue'
$roots = @(
  'C:\Users\spenc\Code',
  'C:\Users\spenc\clawd',
  'C:\Users\spenc\earth-journey-portfolio',
  'C:\Users\spenc\hyperliquid-telegram-agent',
  'C:\Users\spenc\polytopia-game',
  'C:\Users\spenc\Solana DeFi Bot',
  'C:\Users\spenc\solar-prospector',
  'C:\Users\spenc\Solar Identifier'
)
$roots = $roots | Where-Object { Test-Path $_ }
if ($roots.Count -eq 0) { $roots = @('C:\Users\spenc') }

$pkgDirs = foreach ($r in $roots) {
  Get-ChildItem -Path $r -Recurse -File -Filter package.json -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
    Select-Object -ExpandProperty DirectoryName
}

$gitDirs = foreach ($r in $roots) {
  Get-ChildItem -Path $r -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { Test-Path (Join-Path $_.FullName '.git') } |
    Select-Object -ExpandProperty FullName
}

$all = @($pkgDirs + $gitDirs) | Sort-Object -Unique
$all
