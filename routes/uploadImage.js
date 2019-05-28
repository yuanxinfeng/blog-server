/*
 * @Author: Yuanxinfeng
 * @Date: 2018-08-22 11:46:36
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-09-06 16:33:43
 */
const router = require("koa-router")();
const fs = require("fs");
const path = require("path");

router.prefix("/api/uploadImage");

const timeFormat = function() {
  let time = new Date();
  return (
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
  );
};

const uploadUrl =
  process.env.NODE_ENV !== "production"
    ? `http://127.0.0.1:10000/${timeFormat()}`
    : `https://adminblog.yuanxinfeng.xyz:10000/${timeFormat()}`;
router.get("/", async (ctx) => {});
// 图片上传
router.post("/add", async (ctx) => {
  try {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let filePath = path.resolve() + `/static/${timeFormat()}/`;
    let fileResource = filePath + `/${file.name}`;
    if (!fs.existsSync(filePath)) {
      //判断staic/upload文件夹是否存在，如果不存在就新建一个
      fs.mkdir(filePath, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          let upstream = fs.createWriteStream(fileResource);
          reader.pipe(upstream);
          ctx.body = {
            code: 200,
            msg: "上传成功!",
            data: {
              url: uploadUrl + `/${file.name}`
            }
          };
          return;
        }
      });
    } else {
      let upstream = fs.createWriteStream(fileResource);
      reader.pipe(upstream);
      ctx.body = {
        code: 200,
        msg: "上传成功!",
        data: {
          url: uploadUrl + `/${file.name}`
        }
      };
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 500,
      msg: "请求失败!"
    };
  }
});
module.exports = router;
