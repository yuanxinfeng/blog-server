const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const { isArray, isString } = require("./utils");

const cors = require("koa2-cors");
require("./utils/formatDate");

const routes = require("./routes/index");

const { check_token } = require("./utils/token");

// error handler
onerror(app);

// 判断origin是否在域名白名单列表中
function isOriginAllowed(origin, allowedOrigin) {
  if (isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; i++) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (isString(allowedOrigin)) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
}
const ALLOW_ORIGIN = [
  // 域名白名单
  "http://localhost:8888",
  "http://192.168.1.106:9999",
  "http://localhost:9999",
  "https://118.24.35.13:8888",
  "https://118.24.35.13:9999"
];
app.use(
  cors({
    origin: function(ctx) {
      let reqOrigin = ctx.req.headers.origin; // request响应头的origin属性
      // 判断请求是否在域名白名单内
      if (isOriginAllowed(reqOrigin, ALLOW_ORIGIN)) {
        // 设置CORS为请求的Origin值
        return reqOrigin;
      }
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"], //设置允许的HTTP请求类型
    allowHeaders: ["Content-Type", "Authorization", "Accept"]
  })
);
// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(check_token);

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
// console.log(index.routes())
// app.use(index.routes(), index.allowedMethods())
routes(app);

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
