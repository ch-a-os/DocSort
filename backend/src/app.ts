import * as fs from 'fs';
import { Mongoose } from "mongoose";
import { insertDummyData } from './insertDummyData';
import * as del from "del";
import { createExpressServer, registerExpressRoutes } from './lib/express';
import { Config } from './config';
import { log } from './lib/logging';
import { setProcessEvents } from "./lib/processEvents";
import { ApplicationError } from './lib/applicationError';

const mongoose: Mongoose = require("mongoose");

export const configManager: Config = new Config(null);

async function run() {

    // Setup ErrorHandlers
    setProcessEvents();

    try {        
        // Init and validate config.json
        await configManager.readConfig();
        log.info("DocSort is starting, please stand by ...");

        if (fs.existsSync("./uploads")) {
            del.sync("./uploads");
        }
        fs.mkdirSync("./uploads");
        log.info("Uploads-folder existing");
        
        mongoose.set("bufferCommands", false); // Disable Command-Buffering (DEV-MODE)
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        log.info("Connect to db...");
        try {
            await mongoose.connect(configManager.config.mongodb.url);
        } catch (error) {
            throw new ApplicationError("error while connecting to the database", error);
        }
        log.success("Connected to db");
        
        // Create Express server
        const { app, server } = createExpressServer();

        // Register routes
        registerExpressRoutes(app);
        log.info("Routes registered");

        // Start server
        server.listen(configManager.config.serverPort, () => {
            log.info("Server started on port " + configManager.config.serverPort + "!");
            log.success("DocSort is ready to use");
            if(configManager.config.mongodb.eraseOnStartup) {
                insertDummyData().then(() => {
                    log.success("insertDummyData finished");
                });
            }
        });
    } catch(error) {
        throw new ApplicationError("error in main app.js", error);
    }
}

run();