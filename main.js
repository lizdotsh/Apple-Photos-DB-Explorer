const { app, BrowserWindow, dialog} = require('electron')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');


const createWindow = async () => {
    try {
        const win = new BrowserWindow({
        width: 800,
        height: 600
        });

        await win.loadFile('index.html');
        console.log('Window loaded.');
        console.log('User data path:', app.getPath('userData'));
        const gentables_sql_path = path.join(app.getPath('userData'),'resources','gen_tables.sql');
        console.log('gen_tables.sql path:', gentables_sql_path);
        console.log('Waiting for user to select a photo library...');
        const system_photo_library_path = await showOpenDialog(win);
        console.log('User selected:', system_photo_library_path);  
        console.log('Copying database and executing SQL script...');
        if (system_photo_library_path) {
            await handleFileAndDbActions(system_photo_library_path, gentables_sql_path, win);
            console.log('Done.');
            }
    } catch (err) {
        console.error('Error in createWindow:', err);
    }
}

app.whenReady().then(() => {
    createWindow().catch(err => console.error(`Error during app initialization: ${err}`));
});

/*
async function showOpenDialog(win) {
    const result = await dialog.showOpenDialog(win, {
        properties: ['openFile', 'openDirectory']
    });
    if (!result.canceled) {
        return result.filePaths[0];
    }

    return null;
}
*/
function showOpenDialog(win) {
    return new Promise((resolve, reject) => {
        dialog.showOpenDialog(win, {
            properties: ['openFile', 'openDirectory']
        }).then(result => {
            if (!result.canceled) {
            resolve(result.filePaths[0]);
            }
    
            resolve(null);
        }).catch(err => {
            reject(err);
        });
    });
}


    
async function handleFileAndDbActions(system_db_path, dot_sql_path, win) {
    try {
        const db_path = await copyDatabase(system_db_path);
        await readSqlFile(db_path, dot_sql_path);
        win.webContents.send('file-and-db-actions-complete');
    } catch (err) {
        console.error('Error in handleFileAndDbActions:', err);
    }
}

async function readSqlFile(db_path, dot_sql_path) {
    try {
        const sql_file = await fs.readFile(dot_sql_path, 'utf8');

        let db = new sqlite3.Database(db_path);
        console.log('connected to the photo library database')
        console.log('executing SQL script...')
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.exec(sql_file, (err) => {
            if (err) {
                console.error(`Couldn't execute SQL script: ${err}`);
                db.run('ROLLBACK');
                db.close();
                return;
            }
            db.run('COMMIT');
            db.close((err) => {
                if (err) {
                console.error(`Error closing the database: ${err}`);
                }
            });
            });
        });
        console.log('SQL script executed.')
    } catch (err) {
        console.error(`Error in readSqlFile: ${err}`);
    }
}
  
async function copyDatabase(system_photo_library_path) {
    try {
      const system_photo_db_path = path.join(system_photo_library_path, 'database', 'Photos.sqlite');
      const db_path = path.join(app.getPath('userData'), 'photo_lib.sqlite');
      await fs.copyFile(system_photo_db_path, db_path);
      console.log('Database copied.');
      return db_path;
    } catch (err) {
      console.error(`Error in copyDatabase: ${err}`);
      throw err;  // Re-throw to be caught by calling function
    }
}


