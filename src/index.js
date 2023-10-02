const { app, ipcMain, BrowserWindow, dialog } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs").promises;
const path = require("path");
const EventEmitter = require("events");
//const { log } = require("console");
const logEmitter = new EventEmitter();
// test read file gen_tables.sql
const aq = require("arquero");

const createWindow = async () => {
  try {
    const win = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      width: 1200,
      height: 1000,
    });
    logEmitter.on("log-update", (message) => {
      console.log(message);
      win.webContents.send("log-update", message);
    });
    logEmitter.on("error-update", (message) => {
      console.error(message);
      win.webContents.send("error-update", message);
    });

 //   await win.loadFile("index.html");
    await win.loadFile("public/report.html");
    console.log("Window loaded.");
  } catch (err) {
    console.error("Error in createWindow:", err);
  }
};

app.whenReady().then(() => {
  createWindow().catch((err) =>
    console.error(`Error during app initialization: ${err}`)
  );
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

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
  const gentables_sql_path = path.join(
    __dirname,
    "resources",
    "gen_tables.sql"
  );
  const rollup_sql_path = path.join(
    __dirname,
    "resources",
    "rollup.sql"
  );
  logEmitter.emit("log-update", `gen_tables.sql path: ${gentables_sql_path}`);
  logEmitter.emit("log-update", `rollup.sql path: ${rollup_sql_path}`);

  if (system_photo_library_path) {
    await handleFileAndDbActions(
      system_photo_library_path,
      gentables_sql_path,
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

async function handleFileAndDbActions(system_db_path, dot_sql_path, rollup_sql_path) {//, win) {
  try {
    logEmitter.emit(
      "log-update",
      "Copying database and executing SQL script..."
    );
    const db_path = await copyDatabase(system_db_path);
    await readSqlFile(db_path, dot_sql_path, rollup_sql_path);
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
    await fs.copyFile(system_photo_db_path, db_path);
    logEmitter.emit("log-update", `Database copied to ${db_path}`);
    return db_path;
  } catch (err) {
    console.error(`Error in copyDatabase: ${err}`);
    throw err; // Re-throw to be caught by calling function
  }
}

const dbRun = (db, query) =>
  new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const dbExec = (db, query) =>
  new Promise((resolve, reject) => {
    db.exec(query, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const dbClose = (db) =>
  new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const dbGet = (db, query) =>
  new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
const dbGetAll = (db, query) =>
  new Promise((resolve, reject) => {
    db.all(query, (err, rows) => { // Note the use of `all` and `rows`
      if (err) reject(err);
      else resolve(rows);
    });
  });
async function readSqlFile(db_path, dot_sql_path, rollup_sql_path) {
  try {
    const sql_file = await fs.readFile(dot_sql_path, "utf8");
    const rollup_sql_file = await fs.readFile(rollup_sql_path, "utf8");
    let db = new sqlite3.Database(db_path);
    await dbRun(db, "BEGIN TRANSACTION");
    await dbExec(db, sql_file);
    await dbExec(db, rollup_sql_file);
    await dbRun(db, "COMMIT");
    await dbClose(db);
    logEmitter.emit("log-update", "SQL script executed and database closed.");
  } catch (err) {
    logEmitter.emit("error-update", `Error in readSqlFile: ${err}`);
  }
}

async function basicStats(db_path) {
  try {
    let db = new sqlite3.Database(db_path);
    await dbRun(db, "BEGIN TRANSACTION");
    const row = await dbGet(
      db,
      "SELECT COUNT(DISTINCT zuuid) AS photo_count FROM photo_info"
    );
    logEmitter.emit(
      "log-update",
      `Unique Photo count: ${row.photo_count.toLocaleString()} Photos`
    );
    await dbRun(db, "COMMIT");
    await dbClose(db);
  } catch (err) {
    logEmitter.emit("error-update", `Error in basicStats: ${err}`);
  }
}


async function dbquery(sqlQuery) {
  try {
    let db = new sqlite3.Database(path.join(app.getPath("userData"), "photo_lib.sqlite"));
    await dbRun(db, "BEGIN TRANSACTION");
    const rows = await dbGetAll(db, sqlQuery);  // rows will be an array of objects
    await dbRun(db, "COMMIT");
    await dbClose(db);
    return rows;
  } catch (err) {
    console.error("error-update", `Error in basicStats: ${err}`);
  }
}

// changing to work with object of objects instead of array
async function handleQueries(queryarr) {
    try {
      const results = await Promise.all(
        queryarr.map(async (element) => {
          return {
            name: element.name,
            data: await dbquery(element.query),
          };
        })
      );
  
      const res = Object.fromEntries(results.map(({ name, data }) => [name, data]));
      return res;
    } catch (err) {
      console.error("error-update", `Error in handleQueries: ${err}`);
      return null;
    }
  }
  
  ipcMain.on('sql-query', async (event, queryarr) => {
    const res = await handleQueries(queryarr);
    if (res) {
      event.sender.send('sql-results', res);
    }
  });
  