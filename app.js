const Koa = require('koa');
const app = new Koa();
const bookRouter = require('./router/booksRoute')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');
var router = new Router();

app.use(bodyParser());
router.use('/api/books',bookRouter.routes(),bookRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000);