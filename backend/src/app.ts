import * as fs from 'fs';
import { Mongoose } from "mongoose";
import { insertDummyData } from './insertDummyData';
import * as del from "del";
import { createExpressServer, registerExpressRoutes } from './lib/express';
import { Config } from './config';
import { log } from './lib/logging';
import { formatError, ApplicationError, ERROR } from './lib/errorHandler';

const mongoose: Mongoose = require("mongoose");

export const configManager: Config = new Config(null);

async function run() {
    try {
        // Define process events
        process.on('uncaughtException', (err) => {
            formatError(new ApplicationError(ERROR.UncaughtError, err.message));
        });
        process.on('unhandledRejection', () => {
            formatError(new ApplicationError(ERROR.UnhandledRejection));
        });
        process.on('warning', (warn) => {
            log.warn(`${warn.name}: ${warn.message}`);
        })

        // Init and validate config.json
        await configManager.readConfig();
        log.info("DocSort is starting, please stand by ...");

        if (fs.existsSync("./uploads")) {
            del.sync("./uploads");
        }
        fs.mkdirSync("./uploads");
        log.info("Uploads-folder existing");
        
        // Create connection to MongoDB
        try {
            mongoose.set("bufferCommands", false); // Disable Command-Buffering (DEV-MODE)
            mongoose.set("useNewUrlParser", true);
            mongoose.set("useFindAndModify", false);
            mongoose.set("useCreateIndex", true);
            log.info("Connect to db...");
            await mongoose.connect(configManager.config.mongodb.url);
            log.success("Connected to db");
        } catch (error) {
            log.error("There is an error while connection to the database:" + error);
            process.exit(1);
        }

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
    } catch(err) {
        formatError(new ApplicationError(ERROR.UncaughtError, err.message));
    }
}

run();