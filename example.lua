
local rx = require('init');


local single = rx.operators.single.just('Hello'):pipe(
  rx.operators.single.map(function (value)
    return value.." World"
  end),
  rx.operators.single.map(function (value)
    return 'Success: '..value
  end)
)

single:subscribe(
  function (value)
    print(value)
  end,
  function (err)
    print("Error: "..err)
  end
)
