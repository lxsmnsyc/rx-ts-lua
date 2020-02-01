local old_path = package.path

package.path = './build/?.lua;'
local rx = require('src.index')
package.path = old_path
return rx