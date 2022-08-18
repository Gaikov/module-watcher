#!/usr/bin/env node
import chokidar from "chokidar";
import child_process from "child_process";
import fs from "fs-extra";
import {Log} from "./Log.js";

const packageJson = fs.readJsonSync("./package.json");
if (!packageJson) {
    Log.error("Can't read package.json of you module");
    process.exit(-1);
}

const MODULE_NAME = packageJson.name;
const CONFIG_FILE = "watcher.config.json";

let config;
try {
    config = fs.readJsonSync(CONFIG_FILE)
} catch (err) {
    Log.info(`Can't parse ${CONFIG_FILE}, skipping copy...`);
}

let buildProcess;

function build() {
    if (buildProcess) {
        Log.info("...killing build");
        buildProcess.removeAllListeners();
        buildProcess.kill();
        while (!buildProcess.killed) {
            Log.info("...waiting for termination");
        }
    }

    Log.info("running build process...");
    buildProcess = child_process.exec(config["build"]);
    buildProcess.stdout.on("data", data => console.log(data));
    buildProcess.stderr.on("data", data => Log.error(data));

    buildProcess.on("exit", ()=> {
        if (buildProcess.exitCode) {
            Log.error("BUILD FINISHED WITH ERRORS");
        } else {
            Log.info("BUILD FINISHED");
            copyToDependent();
        }
        buildProcess = null;
        Log.info("DONE");
    });
}

function copyToDependent() {


    for (let path of config["dependent-paths"]) {
        path += "/node_modules/" + MODULE_NAME;
        if (fs.existsSync(path)) {
            Log.info("...removing:", path);
            fs.removeSync(path);
        }
        Log.info("...copying to:", path);
        try {
            fs.copySync(config["dist"] || "./dist", path);
        } catch (err) {
            Log.error(err);
        }
    }
    Log.info("COPY FINISHED");
}

let timer;

function onFolderChanged() {
    clearTimeout(timer);
    timer = setTimeout(build, 100);
}

chokidar.watch(config["include"] || ["./"], {
    ignored: config["ignored"] || []
})
    .on('all', onFolderChanged)
    .on('error', function (error) {
        Log.error('Watching error', error);
    })
