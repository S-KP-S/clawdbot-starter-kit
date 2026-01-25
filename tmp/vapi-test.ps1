$apiKey = "be0f4153-6233-4fc8-94b8-8fe13a321dc2"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# List assistants
Write-Host "=== Assistants ==="
$assistants = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Method Get -Headers $headers
$assistants | ConvertTo-Json -Depth 5

# List phone numbers
Write-Host "`n=== Phone Numbers ==="
$phones = Invoke-RestMethod -Uri "https://api.vapi.ai/phone-number" -Method Get -Headers $headers
$phones | ConvertTo-Json -Depth 5
