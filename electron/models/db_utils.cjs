// import * as sqlite from 'better-sqlite3';
// const db_path = path.join(app.getPath("userData"), "photo_lib.sqlite");
// export const db = new sqlite(db_path);

// export function txGetAll(query, params) {
//     let result;
//     db.transaction(() => {
//         result = db.prepare(query).all(params);
//     })();
//     return result;
// }

// export function txGetOne(query, params) {
//     let result;
//     db.transaction(() => {
//         result = db.prepare(query).get(params);
//     })();
//     return result;
// }

// export function arr_reduce(arr, key) {
//     return arr.reduce((obj, item) => {
//         obj[item[key]] = item;
//         return obj;
//     }, {});
// }

// above but in cjs format

const sqlite = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const db_path = path.join(app.getPath("userData"), "photo_lib.sqlite");
const db = new sqlite(db_path);
exports.db = db;
exports.txGetAll = function(query, params) {
    let result;
    db.transaction(() => {
        result = db.prepare(query).all(params);
    })();
    return result;
};
exports.txGetOne = function(query, params) {
    let result;
    db.transaction(() => {
        result = db.prepare(query).get(params);
    })();
    return result;
};
exports.arr_reduce = function(arr, key) {
    return arr.reduce((obj, item) => {
        obj[item[key]] = item;
        return obj;
    }, {});
};
exports.txManyArr = function(arr, prep) {
    
    return result;
}