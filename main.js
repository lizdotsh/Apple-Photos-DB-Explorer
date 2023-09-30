const { app, BrowserWindow, dialog } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs").promises;
const path = require("path");
const EventEmitter = require("events");
//const { log } = require("console");
const logEmitter = new EventEmitter();
// test read file gen_tables.sql

const createWindow = async () => {
  try {
    const win = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      width: 800,
      height: 600,
    });
    logEmitter.on("log-update", (message) => {
      console.log(message);
      win.webContents.send("log-update", message);
    });
    logEmitter.on("error-update", (message) => {
        console.error(message);
        win.webContents.send("error-update", message);
      });

    await win.loadFile("index.html");
    console.log("Window loaded.");
    //await testReadFile();
    logEmitter.emit("log-update", `User data path: ${app.getPath("userData")}`);
    const gentables_sql_path = path.join(
      __dirname,
      "resources",
      "gen_tables.sql"
    );
    logEmitter.emit("log-update", `gen_tables.sql path: ${gentables_sql_path}`);
    logEmitter.emit(
      "log-update",
      "Waiting for user to select a photo library..."
    );
    const system_photo_library_path = await showOpenDialog(win);
    console.log("User selected:", system_photo_library_path);
    if (system_photo_library_path) {
      await handleFileAndDbActions(
        system_photo_library_path,
        gentables_sql_path,
        win
      );
      logEmitter.emit("log-update", "Processing complete.");
    }
    
  } catch (err) {
    console.error("Error in createWindow:", err);
  }
};

app.whenReady().then(() => {
  createWindow().catch((err) =>
    console.error(`Error during app initialization: ${err}`)
  );
});

function showOpenDialog(win) {
  return new Promise((resolve, reject) => {
    dialog
      .showOpenDialog(win, {
        properties: ["openFile", "openDirectory"],
      })
      .then((result) => {
        if (!result.canceled) {
        logEmitter.emit("log-update", `User selected: ${result.filePaths[0]}`);
          resolve(result.filePaths[0]);
        }

        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function handleFileAndDbActions(system_db_path, dot_sql_path, win) {
  try {
    logEmitter.emit(
      "log-update",
      "Copying database and executing SQL script..."
    );
    const db_path = await copyDatabase(system_db_path);
    await readSqlFile(db_path, dot_sql_path);
    await basicStats(db_path);
    win.webContents.send("file-and-db-actions-complete");

  } catch (err) {
    console.error("Error in handleFileAndDbActions:", err);
  }
}
/* 
async function readSqlFile(db_path, dot_sql_path) {
    try {
      const sql_file = await fs.readFile(dot_sql_path, "utf8");
  
      let db = new sqlite3.Database(db_path, (err) => {
        if (err) {
          logEmitter.emit("error-update", `Error connecting to the database: ${err}`);
          return;
        }
        logEmitter.emit("log-update", "Connecting to the photo library database...");
      });
  
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
  
        db.exec(sql_file, (err) => {
          if (err) {
            logEmitter.emit("error-update", `Couldn't execute SQL script: ${err}`);
            db.run("ROLLBACK");
            return;
          }
          db.run("COMMIT");
          logEmitter.emit("log-update", "SQL script executed.");
        });
  
        db.close((err) => {
          if (err) {
            logEmitter.emit("error-update", `Error closing the database: ${err}`);
            return;
          }
          logEmitter.emit("log-update", "Database closed.");
        });
      });
    } catch (err) {
      logEmitter.emit("error-update", `Error in readSqlFile: ${err}`);
    }
} */

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

/* async function basicStats(db_path) {
    let db = new sqlite3.Database(db_path);
    db.serialize(() => {
        // Begin transaction
        db.run("BEGIN TRANSACTION");
        // Get count of unique zuuid values in the photo_info table
        db.get("SELECT COUNT(DISTINCT zuuid) AS photo_count FROM photo_info", (err, row) => {
            if (err) {
               // console.error(`Error getting photo count: ${err}`);
                logEmitter.emit("error-update", `Error getting photo count: ${err}`);
                db.run("ROLLBACK");
                db.close();
                return;
            }
            console.log(`Photo count: ${row.photo_count}`);
            logEmitter.emit("log-update", `Unique Photo count: ${row.photo_count.toLocaleString()} Photos`);
        });
        db.run("COMMIT");
        db.close((err) => {
            if (err) {
                //console.error(`Error closing the database: ${err}`);
                logEmitter.emit("error-update", `Error closing the database: ${err}`);
            }
        });
    });
} */

const dbRun = (db, query) => new Promise((resolve, reject) => {
  db.run(query, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const dbExec = (db, query) => new Promise((resolve, reject) => {
  db.exec(query, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const dbClose = (db) => new Promise((resolve, reject) => {
  db.close((err) => {
    if (err) reject(err);
    else resolve();
  });
});

const dbGet = (db, query) => new Promise((resolve, reject) => {
  db.get(query, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

async function readSqlFile(db_path, dot_sql_path) {
  try {
    const sql_file = await fs.readFile(dot_sql_path, "utf8");
    let db = new sqlite3.Database(db_path);
    await dbRun(db, "BEGIN TRANSACTION");
    await dbExec(db, sql_file);
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
    const row = await dbGet(db, "SELECT COUNT(DISTINCT zuuid) AS photo_count FROM photo_info");
    logEmitter.emit("log-update", `Unique Photo count: ${row.photo_count.toLocaleString()} Photos`);
    await dbRun(db, "COMMIT");
    await dbClose(db);
  } catch (err) {
    logEmitter.emit("error-update", `Error in basicStats: ${err}`);
}
}

async function photoLibraryAvailable() {
    // Check if the user has a photo library available
    // by looking for the Photos.sqlite file in the
    // ~/Pictures/Photos Library.photoslibrary/database directory
    const photos_library_path = path.join(
      app.getPath("pictures"),
      "Photos Library.photoslibrary",
      "database",
      "Photos.sqlite"
    );
    try {
      await fs.access(photos_library_path);
      return true;
    } catch (err) {
      return false;
    }
}

