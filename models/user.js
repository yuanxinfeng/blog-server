/*
 * @Author: Pawn
 * @Date: 2018-08-14 16:16:22
 * @Last Modified by: Pawn
 * @Last Modified time: 2018-08-14 17:16:17
 */
const User = require("../db").User;

module.exports = {
  find_by_user_id(user_id) {
    return User.find({ user_id }, (err, doc) => {
      return err ? [] : doc;
    });
  },
  update(_id, json) {
    return User.findByIdAndUpdate(_id, json, { new: true }, (err, doc) => {
      return err ? false : true;
    });
  }
};
