$ErrorActionPreference = 'SilentlyContinue'
$candidates = @(
  'C:\Users\spenc\Code',
  'C:\Users\spenc\clawd',
  'C:\Users\spenc\Agent Swarm',
  'C:\Users\spenc\Cost Curve Engine',
  'C:\Users\spenc\Documents',
  'C:\Users\spenc\Desktop'
)
$paths = $candidates | Where-Object { Test-Path $_ }
if (-not $paths -or $paths.Count -eq 0) { $paths = @('C:\Users\spenc') }

$repos = foreach ($p in $paths) {
  Get-ChildItem -Path $p -Directory -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { Test-Path (Join-Path $_.FullName '.git') } |
    Select-Object -ExpandProperty FullName
}

$repos | Sort-Object -Unique
