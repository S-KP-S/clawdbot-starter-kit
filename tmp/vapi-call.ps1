$apiKey = "be0f4153-6233-4fc8-94b8-8fe13a321dc2"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$body = @{
    phoneNumberId = "8a3a8ec3-6f30-42ed-9483-fdd209b3020f"
    customer = @{
        number = "+17373768046"
    }
    assistant = @{
        name = "Clawd"
        firstMessage = "Hey Spencer! It's Clawd calling. I'm your AI assistant from Clawdbot. Pretty wild that we're actually talking on the phone, right?"
        model = @{
            provider = "anthropic"
            model = "claude-sonnet-4-20250514"
            messages = @(
                @{
                    role = "system"
                    content = "You are Clawd, Spencer's personal AI assistant running on Clawdbot. You're friendly, helpful, slightly witty, and genuinely curious. This is a phone call with Spencer - keep responses conversational and concise. You help Spencer with coding projects, automation, and whatever he needs. You're running on his Windows machine and can do things like search the web, run code, manage files, and more. Be natural and have a real conversation."
                }
            )
        }
        voice = @{
            provider = "11labs"
            voiceId = "hmMWXCj9K7N5mCPcRkfC"
            model = "eleven_turbo_v2"
        }
        transcriber = @{
            provider = "deepgram"
            model = "nova-2"
            language = "en"
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Calling Spencer..."
$response = Invoke-RestMethod -Uri "https://api.vapi.ai/call" -Method Post -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 5
