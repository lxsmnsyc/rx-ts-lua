
local rx = require('init');

local single = rx.operators.single.just('Hello World')

single:subscribe(
  function (value)
    print("Success: "..value)
  end,
  function (err)
    print("Error: "..err)
  end
)
