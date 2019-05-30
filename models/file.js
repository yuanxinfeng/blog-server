/*
 * @Author: Yuanxinfeng 
 * @Date: 2018-08-14 11:33:10 
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-08-19 14:05:44
 */
const Files = require("../db").File;

module.exports = {
  find_all(json){
    let { querys = {},fields = null,options = {} } = json;
    return Files.find(querys,fields,options,(err,doc) => {
      return err?[]:doc;
    })
    .populate({
      path: 'file_path',
      select: "_id"
    })
  },
  find_by_id(_id){
    return Files.find({_id}, (err,doc) => {
      return err?[]:doc;
    })
  },
  update(_id,json){
    return Files.findByIdAndUpdate(_id, json, { new: true },(err, doc) => {
      return err?false:true;
    })
  },
  delete(_id){
    return Files.findByIdAndRemove(_id, (err,doc) => {
      return err?false:true;
    })
  }
}