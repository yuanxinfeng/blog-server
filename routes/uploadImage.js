/*
 * @Author: Yuanxinfeng
 * @Date: 2018-08-22 11:46:36
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-09-06 16:33:43
 */
const router = require("koa-router")();
const Files = require("../db").File;
const fileModel = require("../models/file");
const fs = require("fs");
const path = require("path");

router.prefix("/api/uploadImage");
const { performance } = require("perf_hooks");

const timeFormat = function() {
  let time = new Date();
  return (
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
  );
};

const generateUUID = function() {
  let d = new Date().getTime();
  d += performance.now();
  let uuid = "xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const uploadUrl =
  process.env.NODE_ENV !== "production"
    ? `http://127.0.0.1:10000/${timeFormat()}`
    : `https://yuanxinfeng.xyz:10000/${timeFormat()}`;
router.get("/", async (ctx) => {});
// 图片上传
router.post("/add", async (ctx) => {
  try {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let filePath = path.resolve() + `/static/${timeFormat()}/`;
    let fileType = file.type.split("/")[1];
    let newFilename = `${generateUUID()}.${fileType}`;
    let fileResource = `${filePath}/${newFilename}`;
    let files = new Files({
      file_path: fileResource,
      file_url: uploadUrl + `/${newFilename}`,
      file_dir: filePath
    });
    let res = await files.save();
    if (res) {
      if (!fs.existsSync(filePath)) {
        //判断staic/upload文件夹是否存在，如果不存在就新建一个
        fs.mkdirSync(filePath);
        let upstream = fs.createWriteStream(fileResource);
        reader.pipe(upstream);
        ctx.body = {
          code: 200,
          msg: "上传成功!",
          data: res
        };
      } else {
        if (fs.existsSync(fileResource)) {
          if (res) {
            await fileModel.delete(res._id);
          }
        } else {
          let upstream = fs.createWriteStream(fileResource);
          reader.pipe(upstream);
        }
        ctx.body = {
          code: 200,
          msg: "上传成功!",
          data: res
        };
      }
    } else {
      ctx.body = {
        code: 500,
        msg: "文件保存失败!"
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

router.post("/del", async (ctx) => {
  let _id = ctx.query.id;
  try {
    if (_id.length != 24) {
      ctx.body = {
        code: 401,
        msg: "图片删除失败，id有误！"
      };
      return;
    }
    let res = await fileModel.find_by_id(_id);
    if (res) {
      let { file_path,file_dir } = res[0];
      fs.unlink(file_path, (err) => {
        if (err) throw err;
        console.log("文件已删除");
        let files = fs.readdirSync(file_dir);
        if(files.length === 0) {
          fs.rmdirSync(file_dir)
        }
      });
      await fileModel.delete(_id);
      ctx.body = {
        code: 200,
        msg: "图片删除成功！"
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "未查到数据！"
      };
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: "图片删除失败！"
    };
  }
});
module.exports = router;
