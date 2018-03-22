## Minimal interpreter of functional language, writen in JavaScript

Write your program in file `program.pls` and execute `node index.js`.

##### Supports variable declaration

```lisp
foo = true
bar = foo
```

Your program need to be writen in functional style. Example:

```lisp
(log (plus 2 3))
```

```lisp
(log (and
  true
  (xor false true)
))
```

```lisp
(log
  (sqrt
    (plus
      21
      (pow 10 2)
    )
  )
)
```

```lisp
foo = 3
(log (if (foo == 3)
  ("foo = 3")
  ("Error")
))
bar = (pow foo 3)
(log bar)
```

Functions are now made:

* `if`
* `plus`
* `minus`
* `multiplication`
* `division`
* `sqrt`
* `pow`
* `not`
* `and`
* `or`
* `xor`
* `log`

Operators are now made:

* <
* \>
* \+
* \-
* \*
* /
* ==
