// // Modules to control application life and create native browser window
const { log } = require("console");
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const EventEmitter = require("events");
const aq = require("arquero");
// const sqlite3 = require("sqlite3").verbose();
const sqlite = require('better-sqlite3');
const TopoJSON = require("topojson-client");
const exportFns = require('./api.cjs');
const  permissions  = require("electron-mac-permissions");
const gentables_sql_path = path.join(__dirname, "assets");
//const gentables_sql_path_16 = path.join(__dirname, "assets", "gen_tables_16.sql");

// cjs versions below
// import { log } from "console";
// import { app, BrowserWindow, ipcMain, dialog } from "electron";
// import path from "path";
// import fs from "fs/promises";
// import EventEmitter from "events";
// import aq from "arquero";
// import sqlite3 from "sqlite3/verbose";
// import TopoJSON from "topojson-client";
// import exportFns from "./api.cjs";


ipcMain.handle('CALL_EXPOSED_MAIN_FN', (event, { methodName, args }) => 
  exportFns[methodName](...args)
);
//const sql = require('sql-tagged-template-literal');

const logEmitter = new EventEmitter();

if (require("electron-squirrel-startup")) app.quit();

const isDevEnvironment = process.env.DEV_ENV === "true";

// enable live reload for electron in dev mode
if (isDevEnvironment) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

let win;

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1700,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  logEmitter.on("log-update", (message) => {
    console.log(message);
    win.webContents.send("log-update", message);
  });
  logEmitter.on("error-update", (message) => {
    console.error(message);
    win.webContents.send("error-update", message);
  });
  // define how electron will load the app
  if (isDevEnvironment) {
       win.loadFile(path.join(__dirname, 'db_load/index.html'));

    // if your vite app is running on a different port, change it here
    // win.loadURL("http://localhost:5173/");

    // Open the DevTools.
    win.webContents.on("did-frame-finish-load", () => {
      win.webContents.openDevTools();
    });

    log("Electron running in dev mode: 🧪");
  } else {
    // when not in dev mode, load the build file instead
    // win.loadFile(path.join(__dirname, "build", "index.html"));

       win.loadFile(path.join(__dirname, 'db_load/index.html'));
    log("Electron running in prod mode: 🚀");
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle("select-directory", async () => {
  let isValid = false;
  let selectedPath = null;

  while (!isValid) {
    const result = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [{ name: "Photo Library", extensions: ["photoslibrary"] }],
      defaultPath: `${process.env.HOME}/Pictures`,
    });

    if (!result) {
      break; // User clicked cancel
    }

    if (result[0].endsWith(".photoslibrary")) {
      selectedPath = result[0];
      isValid = true;
    } else {
      dialog.showMessageBoxSync({
        type: "warning",
        title: "Invalid Selection",
        message: "Please select a .photoslibrary file.",
      });
    }
  }

  return selectedPath;
});

ipcMain.handle("validate-directory", async (event, dirPath) => {
  if (dirPath.endsWith(".photoslibrary")) {
    const sqlitePath = path.join(dirPath, "database", "Photos.sqlite");
    try {
      await fs.access(sqlitePath);
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
});

ipcMain.handle("get-default-directory", () => {
  return `${process.env.HOME}/Pictures/Photos Library.photoslibrary`;
});

ipcMain.handle("generate-report", async (event, system_photo_library_path) => {
  console.log("User selected:", system_photo_library_path);
  logEmitter.emit("log-update", `User data path: ${app.getPath("userData")}`);
  
  const rollup_sql_path = path.join(__dirname, "assets", "rollup.sql");
  logEmitter.emit("log-update", `gen_tables.sql path: ${gentables_sql_path}`);
  logEmitter.emit("log-update", `rollup.sql path: ${rollup_sql_path}`);

  if (system_photo_library_path) {

    await handleFileAndDbActions(
      system_photo_library_path,
      rollup_sql_path
    );
    logEmitter.emit("log-update", "Processing complete.");
  }
});

function showOpenDialog(win) {
  return new Promise((resolve, reject) => {
    logEmitter.emit(
      "log-update",
      "Waiting for user to select a photo library..."
    );
    dialog
      .showOpenDialog(win, {
        properties: ["openFile", "openDirectory"],
      })
      .then((result) => {
        if (!result.canceled) {
          logEmitter.emit(
            "log-update",
            `User selected: ${result.filePaths[0]}`
          );
          resolve(result.filePaths[0]);
        }

        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function chooseSqlFile(db_path, sql_path) {
    try { 
        let db = new sqlite(db_path);
        const result = db.pragma('table_info(ZDETECTEDFACE);');
        db.close();
        logEmitter.emit(result);
        const in_res = result.some(e => e.name === 'ZASSETFORFACE')
        logEmitter.emit('log-update', `Library Version: ${in_res ? '17' : '16'}`);
        const file = path.join(sql_path, in_res ? 'gen_tables.sql' : 'gen_tables_16.sql');
        logEmitter.emit("log-update", `Using ${file} for gen_tables.`);
        return file;
    } catch (err) {
        logEmitter.emit("error-update", `Error in chooseSqlFile: ${err}`);
        throw err;
    }
}

async function handleFileAndDbActions(
  system_db_path,
  rollup_sql_path
) {
  //, win) {
  try {
    logEmitter.emit(
      "log-update",
      "Requesting Permissions..."
    );
    const db_path = await copyDatabase(system_db_path);
    const sql_file = chooseSqlFile(db_path, gentables_sql_path);
    await readSqlFile(db_path, sql_file, rollup_sql_path);
    
    await basicStats(db_path);
    //win.webContents.send("file-and-db-actions-complete");
  } catch (err) {
    console.error("Error in handleFileAndDbActions:", err);
  }
}

async function copyDatabase(system_photo_library_path) {
  try {
    const system_photo_db_path = path.join(
      system_photo_library_path,
      "database",
      "Photos.sqlite"
    );
    const db_path = path.join(app.getPath("userData"), "photo_lib.sqlite");
    //shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles');
    const perms = await permissions.askForPhotosAccess('read-write');
    console.log(perms);
    if (perms === 'denied') {
        logEmitter.emit("error-update", "Permission denied. Please grant access to your Photos library in System Preferences.");
        throw new Error("Permission denied. Please grant access to your Photos library in System Preferences.");
    } else {
        logEmitter.emit("log-update", "Permission granted.");
        logEmitter.emit("log-update", "Copying database...");
        await fs.copyFile(system_photo_db_path, db_path);
        return db_path;
    }
  } catch (err) {
    console.error(`Error in copyDatabase: ${err}`);
    throw err; // Re-throw to be caught by calling function
  }
}

// const dbRun = (db, query) =>
//   new Promise((resolve, reject) => {
//     db.run(query, (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });

// const dbExec = (db, query) =>
//   new Promise((resolve, reject) => {
//     db.exec(query, (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });

// const dbClose = (db) =>
//   new Promise((resolve, reject) => {
//     db.close((err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });

// const dbGet = (db, query) =>
//   new Promise((resolve, reject) => {
//     db.get(query, (err, row) => {
//       if (err) reject(err);
//       else resolve(row);
//     });
//   });
// const dbGetAll = (db, query) =>
//   new Promise((resolve, reject) => {
//     db.all(query, (err, rows) => {
//       // Note the use of `all` and `rows`
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
async function readSqlFile(db_path, sql_path, rollup_sql_path) {
  try {
    logEmitter.emit("log-update", db_path);
    const sql_file = await fs.readFile(sql_path, "utf8");
    const rollup_sql_file = await fs.readFile(rollup_sql_path, "utf8");
    logEmitter.emit("log-update", "SQL script read.");
    // logEmitter.emit("log-update", sql_file);
    let db = new sqlite(db_path);
    logEmitter.emit("log-update", "Running SQL script... may freeze up momentarily...");
    // logEmitter.emit("log-update", sql_file);
    db.transaction(() => {
        db.exec(sql_file);
        db.exec(rollup_sql_file);
    })();
    db.close();
   // let db = new sqlite3.Database(db_path);
    // await dbRun(db, "BEGIN TRANSACTION");
    // await dbExec(db, sql_file);
    // await dbExec(db, rollup_sql_file);
    // await dbRun(db, "COMMIT");
    // await dbClose(db);
    logEmitter.emit("log-update", "SQL script executed and database closed.");
    win.loadFile(path.join(__dirname, "build", "index.html"));
  } catch (err) {
    logEmitter.emit("error-update", `Error in readSqlFile: ${err}`);
  }
}

async function basicStats(db_path) {
  try {
    let db = new sqlite(db_path);
    // await dbRun(db, "BEGIN TRANSACTION");
    row = db.prepare("SELECT COUNT(DISTINCT zuuid) AS photo_count FROM photo_info").run();
    db.close();
    logEmitter.emit(
      "log-update",
      `Unique Photo count: ${row.photo_count.toLocaleString()} Photos`
    );
    console.log(row);
  } catch (err) {
    logEmitter.emit("error-update", `Error in basicStats: ${err}`);
  }
}

// async function dbquery(sqlQuery) {
//   try {
//     let db = new sqlite3.Database(
//       path.join(app.getPath("userData"), "photo_lib.sqlite")
//     );
//     await dbRun(db, "BEGIN TRANSACTION");
//     const rows = await dbGetAll(db, sqlQuery); // rows will be an array of objects
//     await dbRun(db, "COMMIT");
//     await dbClose(db);
//     return rows;
//   } catch (err) {
//     console.error("error-update", `Error in basicStats: ${err}`);
//   }
// }

// // changing to work with object of objects instead of array
// async function handleQueries(queryarr) {
//   try {
//     const results = await Promise.all(
//       queryarr.map(async (element) => {
//         return {
//           name: element.name,
//           data: await dbquery(element.query),
//         };
//       })
//     );

//     const res = Object.fromEntries(
//       results.map(({ name, data }) => [name, data])
//     );
//     // if results have item.year_month convert to date
//     if (res[0]?.year_month) {
//       return res.map((item) => {
//         item.year_month = new Date(item.year_month);
//         return item;
//       });
//     } else {
//       return res;
//     }
//   } catch (err) {
//     console.error("error-update", `Error in handleQueries: ${err}`);
//     return null;
//   }
// }

// ipcMain.on("sql-query", async (event, queryarr) => {
//   const res = await handleQueries(queryarr);
//   if (res) {
//     event.sender.send("sql-results", res);
//   }
// });

// sendsql but async using handle/invoke



// ipcMain.handle("daily-zeroed-counts", async (event, name_entry) => {
//   try {
//     // probably insecure as fuck but whatever it's a local db lol
//     const query = `
//             with cnt as (
//             select 
//             photos_per_user_daily.full_name as full_name,
//             date_series.date as date,
//             sum(ifnull(photos_per_user_daily.count, 0)) as count
    
//             from date_series 
//             left join photos_per_user_daily on date_series.date = photos_per_user_daily.date 
//             and photos_per_user_daily.full_name = '${name_entry}'
//             where date_series.date >= (select min(date) from photos_per_user_daily where full_name = '${name_entry}')
//             and date_series.date <= (select max(date) from photos_per_user_daily where full_name ='${name_entry}')
//             group by 1,2
//             order by date_series.date
//             ),
//             -- I know this is horribly inefficient lmao
//             seven as (
//             select 
//             date,
//             count,
//             sum(count) OVER (
//                 ORDER BY date
//                 ROWS BETWEEN 7 PRECEDING AND current row 
//             ) as seven_day_sum
//             from cnt
//             )
//             select 
//             '${name_entry}' as full_name,
//             date, 
//             count, 
//             seven_day_sum,
//             AVG(seven_day_sum) OVER (
//                 ORDER BY date
//                 ROWS BETWEEN 30 PRECEDING AND current row 
//             ) as 'thirty_day_rolling',
//             AVG(seven_day_sum) OVER (
//                 ORDER BY date
//                 ROWS BETWEEN 90 PRECEDING AND current row 
//             ) as 'ninety_day_rolling'
//             from seven;
//             `;

//     const results = await dbquery(query);
//     //console.log('ran daily-zeroed-counts query');
//     if (results) {
//       return results;
//     }
//   } catch (err) {
//     console.error("error in daily-zeroed-counts", err);
//     throw err;
//   }
// });

// ipcMain.handle("call-lat-long", async (event, { elm_name, start_date, end_date }) => {
//     try { 
//         query = `select 
//         zuuid,
//         full_name,
//         latitude,
//         longitude
//         from photo_info
//         where latitude is not null
//         and longitude is not null
    
//         and date_created >= '${start_date ?? "1900-01-01"}'
//         and date_created <= '${end_date ?? "2100-01-01"}'
//         order by date_created asc;
//         `//    and full_name = '${elm_name}'
//         console.log(query);
//         const results = await dbquery(query);
//         if (results) {
//             // console.log(results);
//             return results;
//         }
//     } catch (err) {
//         console.error("error-update", `Error in call-lat-long: ${err}`);
//         throw err;
//     }
// });
// ipcMain.handle("call-map-json", async (event, type) => {
//     try {
//     const world_file = await fs.readFile(path.join(__dirname, "assets", type + ".json")); 
//     const world_json = JSON.parse(world_file);
//   //  const countries = TopoJSON.feature(world_json, world_json.objects.countries);
//     return world_json;
//     } catch (err) {
//         console.error("error-update", `Error in call-world-json: ${err}`);
//         throw err;
//     }
    
// });
/* ipcMain.handle(
    "call-start-end-dates",
    async (event, { elm_name }) => {
      try {
        query = `  select 
            min(date) as start_date,
            max(date) as end_date

          full_name, 
          year_month,
          sum(count) as count
          from photo_info_rollup_monthly
          where year_month >= '${start_date ?? "1900-01-01"}' 
          and year_month <= '${end_date ?? "2100-01-01"}'
          and full_name != 'no_name'
          and full_name != 'no_face'
          group by 1,2
          order by count desc;
        `;
        console.log(start_date, end_date);
        console.log(query);
        const results = await dbquery(
          query
          //`SELECT * FROM person_group_stats WHERE full_name = '${name_entry}'`
        );
        if (results) {
          // console.log(results);
          return results;
        }
      } catch (err) {
        console.error("error-update", `Error in call-person-group-stats: ${err}`);
        throw err;
      }
    }
  );
 */