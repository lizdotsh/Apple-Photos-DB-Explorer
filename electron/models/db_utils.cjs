const sqlite = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");
const db_path = path.join(app.getPath("userData"), "photo_lib.sqlite");
let db = new sqlite(db_path);
exports.db = db;
exports.txGetAll = function (query, params) {
  let result;
  db.transaction(() => {
    result = db.prepare(query).all(params);
  })();
  return result;
};
exports.resetDb = function () {
    db.close();
    db = new sqlite(db_path);
    exports.db = db;

}
exports.txExecAll = function (file) {
    db.transaction(() => {
        db.exec(file);
    })();
};
exports.getPragma = function (query) {
    return db.pragma(query);
}
exports.txGetOne = function (query, params) {
  let result;
  db.transaction(() => {
    result = db.prepare(query).get(params);
  })();
  return result;
};
exports.arr_reduce = function (arr, key) {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};
exports.txManyArr = function (arr, prep) {
  return result;
};
