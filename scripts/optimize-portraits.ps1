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

function Get-CenteredSquare([int]$sourceWidth, [int]$sourceHeight) {
  $side = [Math]::Min($sourceWidth, $sourceHeight)
  return [System.Drawing.Rectangle]::new(
    [int](($sourceWidth - $side) / 2),
    [int](($sourceHeight - $side) / 2),
    $side,
    $side
  )
}

function Convert-Portrait([System.IO.FileInfo]$sourceFile, [string]$outputDirectory, [bool]$balanced = $false) {
  $source = [System.Drawing.Image]::FromFile($sourceFile.FullName)
  $canvas = New-Object System.Drawing.Bitmap $Width, $Height
  $canvas.SetResolution(96, 96)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)

  try {
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::White)
    if ($balanced) {
      $sourceBounds = Get-CenteredSquare $source.Width $source.Height
      $photoBounds = [System.Drawing.Rectangle]::new(20, 110, 680, 680)
      $graphics.DrawImage(
        $source,
        $photoBounds,
        $sourceBounds.X,
        $sourceBounds.Y,
        $sourceBounds.Width,
        $sourceBounds.Height,
        [System.Drawing.GraphicsUnit]::Pixel
      )
    }
    else {
      $photoBounds = Get-ContainRectangle $source.Width $source.Height $Width $Height
      $graphics.DrawImage($source, $photoBounds)
    }

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

$balancedRegionFiles = @(
  'bryansk-titelman.jpg',
  'moscow-yakushev.png',
  'vologda-viktorov.jpg',
  'karelia-tsvibel.jpg',
  'nizhny-novgorod-turaeva.jpg',
  'penza-zheltova.jpg',
  'mordovia-drobin.jpg',
  'tatarstan-pliskin.jpg',
  'samara-kogan.jpg',
  'kaluga-denisov.jpg'
)

$leadershipDirectory = Join-Path $workspaceRoot 'leadership-photos'
$leadershipOutput = Join-Path $leadershipDirectory 'optimized'
[System.IO.Directory]::CreateDirectory($leadershipOutput) | Out-Null
Get-ChildItem -LiteralPath $leadershipDirectory -File |
  Where-Object { $_.Extension -match '^\.(png|jpe?g)$' } |
  ForEach-Object { Convert-Portrait $_ $leadershipOutput }

$regionDirectory = Join-Path $workspaceRoot 'region-leaders'
$regionOutput = Join-Path $regionDirectory 'optimized'
[System.IO.Directory]::CreateDirectory($regionOutput) | Out-Null
Get-ChildItem -LiteralPath $regionDirectory -File |
  Where-Object { $_.Extension -match '^\.(png|jpe?g)$' } |
  ForEach-Object { Convert-Portrait $_ $regionOutput ($balancedRegionFiles -contains $_.Name) }

foreach ($sharedPortrait in @('mark-goldin.png', 'mikhail-oshtrakh.png')) {
  Convert-Portrait (Get-Item -LiteralPath (Join-Path $leadershipDirectory $sharedPortrait)) $regionOutput $true
}

$qualityParameters.Dispose()
