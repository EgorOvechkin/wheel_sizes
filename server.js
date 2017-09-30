//сторонние модули
const Koa = require('koa'),
      Router = require('koa-router'),
      Boom = require('boom'),
      hbs = require('koahub-handlebars');

//константы
const {createMySQLConnection} = require('./helpers'),
      dbOptions = {
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'wheel_sizes'
      },
      db = createMySQLConnection(dbOptions),
      app = new Koa(),
      router = new Router();


router
  .get('/', async ctx => {
    const dbTables = await db.q('SHOW TABLES;');
    const tables = dbTables.map(result => result[`Tables_in_${dbOptions.database}`].replace('_', '-'));
    await ctx.render('main', {title: 'test', tables});
    // db.destroy();
  });

app
  .use(hbs.middleware({
    extname: '.handlebars',
    viewPath: './public/templates',
    layoutsPath: './public/templates',
    defaultLayout: 'layout'
  }))
  .use(router.routes())
  .use(router.allowedMethods({
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed()
  }))

  .listen(3000);