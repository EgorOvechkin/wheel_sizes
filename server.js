const Koa = require('koa');
const Router = require('koa-router');
const Boom = require('boom');
const hbs = require('koahub-handlebars');
// const views = require('koa-views');

const app = new Koa();
const router = new Router();

router
  .get('/', async ctx => {
    await ctx.render('main', {title: 'test', numbers: [10, 11, 21, 31]});
  })
  // .get('/haml', async ctx => {
  //   await ctx.render('mainhaml')
  // })

app
  .use(hbs.middleware({
    extname: '.handlebars',
    viewPath: './public/templates',
    layoutsPath: './public/templates',
    defaultLayout: 'layout'
  }))
  // .use(views(__dirname + '/public/templates', {
  //   extension: 'haml',
  //   map: {
  //     haml: 'haml'
  //   }
  // }))
  .use(router.routes())
  .use(router.allowedMethods({
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed()
  }))

  .listen(3000);