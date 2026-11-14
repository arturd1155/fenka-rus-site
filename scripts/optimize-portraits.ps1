param(
  [int]$Width = 720,
  [int]$Height = 900,
  [int]$Quality = 82
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } |
  Select-Object -First 1
$qualityParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
$qualityParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  [long]$Quality
)

function Get-ContainRectangle([int]$sourceWidth, [int]$sourceHeight, [int]$targetWidth, [int]$targetHeight) {
  $scale = [Math]::Min($targetWidth / $sourceWidth, $targetHeight / $sourceHeight)
  $drawWidth = [int][Math]::Floor($sourceWidth * $scale)
  $drawHeight = [int][Math]::Floor($sourceHeight * $scale)
  return [System.Drawing.Rectangle]::new(
    [int](($targetWidth - $drawWidth) / 2),
    [int](($targetHeight - $drawHeight) / 2),
    $drawWidth,
    $drawHeight
  )
}

function Convert-Portrait([System.IO.FileInfo]$sourceFile, [string]$outputDirectory) {
  $source = [System.Drawing.Image]::FromFile($sourceFile.FullName)
  $canvas = New-Object System.Drawing.Bitmap $Width, $Height
  $canvas.SetResolution(96, 96)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)

  try {
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::White)
    $photoBounds = Get-ContainRectangle $source.Width $source.Height $Width $Height
    $graphics.DrawImage($source, $photoBounds)

    $outputName = [System.IO.Path]::GetFileNameWithoutExtension($sourceFile.Name) + '.jpg'
    $outputPath = Join-Path $outputDirectory $outputName
    $canvas.Save($outputPath, $jpegCodec, $qualityParameters)
  }
  finally {
    $graphics.Dispose()
    $canvas.Dispose()
    $source.Dispose()
  }
}

foreach ($folderName in @('leadership-photos', 'region-leaders')) {
  $sourceDirectory = Join-Path $workspaceRoot $folderName
  $outputDirectory = Join-Path $sourceDirectory 'optimized'
  [System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
  Get-ChildItem -LiteralPath $sourceDirectory -File |
    Where-Object { $_.Extension -match '^\.(png|jpe?g)$' } |
    ForEach-Object { Convert-Portrait $_ $outputDirectory }
}

$qualityParameters.Dispose()
