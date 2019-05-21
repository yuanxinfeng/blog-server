/*
 * @Author: Yuanxinfeng
 * @Date: 2018-08-13 16:14:16
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-09-05 22:14:51
 */

const router = require("koa-router")();
const createTimeModel = require("../models/createTime");

router.prefix("/api/createTime");

// 标签 => 查询所有标签,
router.get("/", async (ctx) => {
  try {
    let res = await createTimeModel.find_all();
    ctx.body = {
      code: 200,
      msg: "获取创建时间成功！",
      data: res[0]
    };
  } catch (e) {
    ctx.body = {
      code: 500,
      msg: "获取创建时间失败,服务器繁忙!"
    };
  }
});

module.exports = router;
