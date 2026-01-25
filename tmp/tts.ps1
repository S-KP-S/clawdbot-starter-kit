$apiKey = "sk_81ac05fe30f6719dab7d80380a3422284c43d7eb575fd597"
$voiceId = "hmMWXCj9K7N5mCPcRkfC"
$text = "Hey Spencer, this is your custom voice. Sounds pretty good, right?"
$outFile = "C:\Users\spenc\clawd\tmp\test_voice.mp3"

$body = @{
    text = $text
    model_id = "eleven_turbo_v2"
} | ConvertTo-Json

$headers = @{
    "xi-api-key" = $apiKey
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId" -Method Post -Headers $headers -Body $body -OutFile $outFile
Write-Host "Saved to $outFile"
