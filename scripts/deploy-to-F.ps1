# Run on the USER Windows machine to unpack into F:\
param(
  [Parameter(Mandatory=$true)][string]$ArchivePath
)
$ErrorActionPreference = "Stop"
$destKo = "F:\반려문화증진위원회"
$destEn = "F:\pet-culture-committee"
New-Item -ItemType Directory -Force -Path $destKo | Out-Null
New-Item -ItemType Directory -Force -Path $destEn | Out-Null
tar -xzf $ArchivePath -C "F:\"
Write-Host "Extracted. Checking destinations..."
Get-ChildItem F:\ | Select-Object Name
Write-Host "Next: cd into folder, npm install, npm run dev"
