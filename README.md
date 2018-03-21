## Minimal interpreter of functional language, writen in JavaScript

Write your program in file `program.pls` and execute `node index.js`.

Your program need to be writen in functional style. Example:

```lisp
(plus 2 3)
```

```lisp
(and
  true
  (xor false true)
)
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
(if (0 > 1) (
    '0>1'
  )(
  '1<=0'
  )
)
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

* \<
* \>
* \+
* \-
* \*
* /
