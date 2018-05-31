; home
g28

; disable autoleveling etc
m321
m322
m323 s0

; go to 0, 0 at 5mm above, check this to not break probe
g1 x0 y0 z5 f5000
g4 s1
g1 z6  f10

; first point
g1 x0 y70 f800
g4 s1
g30

g1 x60.62 y35
g4 s1
g30

g1 x60.62 y-35
g4 s1
g30

g1 x0 y-70
g4 s1
g30

g1 x-60.62 y-35
g4 s1
g30

g1 x-60.62 y35
g4 s1
g30

g1 x0 y35
g4 s1
g30

g1 x30.31 y-17.50
g4 s1
g30

g1 x-30.31 y-17.50
g4 s1
g30

g1 x0 y0
g4 s1
g30
