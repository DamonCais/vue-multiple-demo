const path = require('path')
const Koa = require('koa')
const static = require('koa-static')
const app = new Koa()
const staticPath = './dist'
app.use(static(
    path.join(__dirname, staticPath)
))
app.listen(8081, () => {
    console.log('[demo] jsonp is starting at port 8081')
})