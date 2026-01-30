# Transcribe audio using Vibe (local Whisper)
param(
    [Parameter(Mandatory=$true)]
    [string]$AudioFile
)

$vibePath = "C:\Users\spenc\AppData\Local\vibe\vibe.exe"
$modelPath = "C:\Users\spenc\clawd\models\ggml-small.bin"
$outFile = "C:\Users\spenc\clawd\tmp\transcript.txt"

& $vibePath --model $modelPath --file $AudioFile --format txt --write $outFile 2>$null

if (Test-Path $outFile) {
    $transcript = Get-Content $outFile -Raw
    Write-Output $transcript.Trim()
} else {
    Write-Error "Transcription failed"
    exit 1
}
