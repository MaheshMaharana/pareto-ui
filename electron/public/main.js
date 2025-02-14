const { app, BrowserWindow, protocol } = require('electron')
const log = require('electron-log');
const Store = require("electron-store")
const storage = new Store();

log.transports.file.resolvePath = () => path.join(__dirname, '/logsmain.log');
log.transports.file.level = "info";

exports.log = (entry) => log.info(entry)

const path = require('path')
require('dotenv').config()

const axios = require('axios').default;
const isDev = require('electron-is-dev')
const { spawn, execFile } = require("child_process")

// Python server parameters
const PY_HOST = "127.0.0.1";
const PY_PORT = 8001;
const UI_PORT = 3000;
const PY_LOG_LEVEL = "info";
let uiReady = false

const serverURL = `http://localhost:${PY_PORT}`
const uiURL = `http://localhost:${UI_PORT}`

require('@electron/remote/main').initialize()

function getWindowSettings () {
  const default_bounds = [800, 600]

  const size = storage.get('win-size');

  if (size) return size;
  else {
    storage.set("win-size", default_bounds);
    return default_bounds;
  }
}

function saveBounds (bounds) {
  storage.set("win-size", bounds)
}


function createWindow() {
  const bounds = getWindowSettings();
  console.log('bounds:',bounds)

  // Create the browser window.
  const win = new BrowserWindow({
    width: bounds[0],
    height: bounds[1],
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    }
  })
  if (isDev) {
    win.webContents.openDevTools()
  } 
  
  console.log("storing user preferences in: ",app.getPath('userData'));

  // save size of window when resized
  win.on("resized", () => saveBounds(win.getSize()));

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

const startServer = () => {
    if (isDev) {

      backendProcess = spawn("uvicorn", 
        [
            "main:app",
            "--reload",
            "--host",
            "127.0.0.1",
            "--port",
            PY_PORT,
        ],
        {
            cwd: '../backend/app'
        }
    );
    // backendProcess = spawn(
    //   path.join(__dirname, "../py_dist/main/main"),
    //   [
    //     ">> mainjslogs.log"
    //   ]
    // );
      log.info("Python Started in dev mode");
      console.log("Python Started in dev mode");
    } else {
      console.log("spawning backend from : "+__dirname)
      log.info("spawning backend from : "+__dirname)
      try {
        backendProcess = spawn(
          path.join(__dirname, "../py_dist/main/main"),
          [
            ">> mainjslogs.log"
          ]
        );
        var scriptOutput = "";
        backendProcess.stdout.setEncoding('utf8');
        backendProcess.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
            log.info('stdout: ' + data);
            data=data.toString();
            scriptOutput+=data;
        });

        backendProcess.stderr.setEncoding('utf8');
        backendProcess.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            log.info('stderr: ' + data);
            data=data.toString();
            scriptOutput+=data;
        });
        log.info("Python process started in built mode");
        console.log("Python process started in built mode");
      } catch (error) {
        log.info("unable to start python process in build mode: ");
        log.info(error)
        console.log("unable to start python process in build mode: ");
        console.log(error)
      }
      
    }
    return backendProcess;
}


app.whenReady().then(() => {
    // Entry point
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = request.url.replace('file:///', '');
      callback(pathname);
    });

    let serverProcess = startServer()
    // let uiProcess = startUI()
    let noTrails = 0
    // Start Window 
    var startUp = (url, appName, spawnedProcess, successFn=null, maxTrials=15) => {
        
        axios.get(url).then(() => {
            console.log(`${appName} is ready at ${url}!`)
            log.info(`${appName} is ready at ${url}!`)
            if (successFn) {
                successFn()
            }
        })
        .catch(async () => {
            console.log(`Waiting to be able to connect ${appName} at ${url}...`)
            log.info(`Waiting to be able to connect ${appName} at ${url}...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            noTrails += 1
            if (noTrails < maxTrials) {
                startUp(url, appName, spawnedProcess, successFn, maxTrials)
            }
            else {
                console.error(`Exceeded maximum trials to connect to ${appName}`)
                log.info(`Exceeded maximum trials to connect to ${appName}`)
                spawnedProcess.kill('SIGINT')
            }
        });
    };
    startUp(serverURL, 'FastAPI Server', serverProcess, createWindow)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('quit', () => {
      console.log('shutting down backend server')
      serverProcess.kill()
  })
})

// For windows & linux platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


