require('dotenv').config()

const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const bouncer = require('koa-bouncer')

const auth = (ctx, next = () => {}) => {
  if (ctx.get('KEY') !== process.env.KEY) {
    ctx.throw(401, '不正确的key')
  } else {
    return next()
  }
}

const startWebServer = async () => {
  const app = new Koa;
  const NODE_ENV = (ref = process.env.NODE_ENV) != null ? ref : 'dev';

  app.use(bouncer.middleware())
  app.use(cors())
  app.use(bodyParser())
  app.use(logger({ dev: NODE_ENV }));

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      if (err.name === 'ValidationError') {
        ctx.status = 400;
      }
      ctx.body = { code: ctx.status, data: null, msg: err.message }
    }
  });

  router = new KoaRouter;

  // router.get('/fuck', ctx => {})

  app.use(router.routes()).use(router.allowedMethods());
  const port = process.env.SERVER_PORT || 4000;
  app.listen(port);
  return console.log(`The server listening port:${port}`);
}

startWebServer()
