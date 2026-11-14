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
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      [System.Drawing.Rectangle]::new(0, 0, $Width, $Height),
      [System.Drawing.Color]::FromArgb(246, 249, 251),
      [System.Drawing.Color]::FromArgb(220, 234, 244),
      135
    )
    try { $graphics.FillRectangle($background, 0, 0, $Width, $Height) } finally { $background.Dispose() }
    $photoBounds = Get-ContainRectangle $source.Width $source.Height ($Width - 56) ($Height - 56)
    $photoBounds.Offset(28, 28)
    $shadowBounds = [System.Drawing.Rectangle]::new($photoBounds.X, $photoBounds.Y + 8, $photoBounds.Width, $photoBounds.Height)
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(45, 7, 28, 48))
    try { $graphics.FillRectangle($shadow, $shadowBounds) } finally { $shadow.Dispose() }
    $graphics.DrawImage($source, $photoBounds)
    $border = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(112, 255, 255, 255)), 2
    try { $graphics.DrawRectangle($border, $photoBounds) } finally { $border.Dispose() }

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
