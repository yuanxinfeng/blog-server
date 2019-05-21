/*
 * @Author: Yuanxinfeng 
 * @Date: 2018-08-13 16:50:32 
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-08-14 14:34:27
 */
const blogCreateTime = require("../db").blogCreateTime

module.exports = {
  find_all(){
    return blogCreateTime.find({}, (err,doc) => {
      return err?[]:doc;
    })
  }
}