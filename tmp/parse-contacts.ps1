$vcf = Get-Content 'C:\Users\spenc\Documents\Contacts list.vcf' -Raw
$contacts = @()
$vcards = $vcf -split '(?=BEGIN:VCARD)'
foreach ($vcard in $vcards) {
    if ($vcard -match 'FN:(.+)') {
        $name = $matches[1].Trim()
        if ($name -and $name -ne '') {
            $phone = ''
            if ($vcard -match 'TEL[^:]*:([+\d\s\(\)\-]+)') {
                $phone = $matches[1].Trim()
            }
            if ($phone) {
                $contacts += [PSCustomObject]@{Name=$name; Phone=$phone}
            }
        }
    }
}
$output = "# Spencer's Contacts`n`nParsed from VCF on $(Get-Date -Format 'yyyy-MM-dd')`n`n"
$contacts | Sort-Object Name -Unique | ForEach-Object { 
    $output += "- **$($_.Name)**: ``$($_.Phone)```n"
}
$output | Out-File -FilePath 'C:\Users\spenc\clawd\contacts.md' -Encoding utf8
Write-Host "Saved $($contacts.Count) contacts"
