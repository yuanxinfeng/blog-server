const router = require('koa-router')();
const tags = require('./tag');
const article = require('./article')
const work = require('./work')
const user = require('./user')
const setting = require('./setting')
const archives = require('./archives')
const createTime = require('./createTime')

router.get('/', ctx => {
  ctx.body = 'hello!'
})

module.exports = function (app) {
  app.use(router.routes(), router.allowedMethods());
  app.use(tags.routes(), tags.allowedMethods());
  app.use(article.routes(), article.allowedMethods());
  app.use(work.routes(), work.allowedMethods());
  app.use(user.routes(), user.allowedMethods());
  app.use(setting.routes(), setting.allowedMethods());
  app.use(archives.routes(), archives.allowedMethods());
  app.use(createTime.routes(), createTime.allowedMethods());
}