const Koa = require('koa');
var hbs = require('koahub-handlebars');
const app = new Koa();

app.use(hbs.middleware({
  extname: '.handlebars',
  viewPath: './public/templates',
  layoutsPath: './public/templates',
  defaultLayout: 'layout'
}));

app.use(async ctx => {
  await ctx.render('main', {title: 'test', numbers: [10, 1, 2, 3]})
});

app.listen(3000);