((a = 1000)

(b = (if true
  (a true)
  (a false)
))

(c => (if true
  (a true)
  (a false)
))

(a = false)

(log (b c))
)
