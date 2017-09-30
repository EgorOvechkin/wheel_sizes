//сторонние модули
const Koa = require('koa'),
      Router = require('koa-router'),
      Boom = require('boom'),
      hbs = require('koahub-handlebars');
require('./templates/helpers')
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
///mmmm.....
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

router
  .get('/', async ctx => {
    const dbTables = await db.q('SHOW TABLES;');
    const brands = dbTables.map(result => {
      const name = result[`Tables_in_${dbOptions.database}`].replace('_', '-');
      return {
        name,
        href: name.toLowerCase() 
      }
    });
    await ctx.render('main', {title: 'test', brands});
    // db.destroy();
  })
  .get('/:brand', async ctx => {
    const tableName = ctx.params.brand
      .replace('-', '_')
      .capitalize();
    const models = await db.q(`SELECT DISTINCT model FROM ${tableName}`);
    console.log(models)

    await ctx.render('main', {title: 'test', brands: models.map(m => {
      const mod = m.model;
      return {
        name: mod,
        href: mod.replace(/(_|\s)/, '-').toLowerCase()
      }
    })});
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