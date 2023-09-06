$r = rg "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}" -o -N -I
$r | group | where { $_.Count -gt 1 } | select Name,Count