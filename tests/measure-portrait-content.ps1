param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$resolvedPath = (Resolve-Path -LiteralPath $Path).Path
$bitmap = [System.Drawing.Bitmap]::FromFile($resolvedPath)

try {
  $minY = $bitmap.Height
  $maxY = -1
  for ($y = 0; $y -lt $bitmap.Height; $y += 3) {
    for ($x = 0; $x -lt $bitmap.Width; $x += 3) {
      $pixel = $bitmap.GetPixel($x, $y)
      if ($pixel.R -lt 242 -or $pixel.G -lt 242 -or $pixel.B -lt 242) {
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  $ratio = if ($maxY -ge $minY) { ($maxY - $minY + 3) / $bitmap.Height } else { 0 }
  $ratio.ToString('0.000', [System.Globalization.CultureInfo]::InvariantCulture)
}
finally {
  $bitmap.Dispose()
}
