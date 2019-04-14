import * as fs from 'fs';
import { Mongoose } from "mongoose";
import { config } from './config';
import { insertDummyData } from './insertDummyData';
import * as del from "del";
import { createExpressServer, registerExpressRoutes } from './lib/express';

const mongoose: Mongoose = require("mongoose");

async function run() {
    console.log("DocSort is starting, please stand by ...");

    // todo: clean db
    console.log("- database cleaned");

    if (fs.existsSync("./uploads")) {
        del.sync("./uploads");
    }
    fs.mkdirSync("./uploads");
    console.log("- uploads-folder existing");
    
    // Create connection to MongoDB
    try {
        mongoose.set("bufferCommands", false); // Disable Command-Buffering (DEV-MODE)
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        console.log("connect to db");
        await mongoose.connect(config.mongodb.url);
        console.log("connected to db");
    } catch (error) {
        console.log("There is an error while connection to the database:", error);
        process.exit(1);
    }
    console.log("- connected to database");

    // Create Express server
    const { app, server } = createExpressServer();

    // Register routes
    registerExpressRoutes(app);
    console.log("- routes registered");

    // Start server
    server.listen(9090, () => {
        console.log("- Server started on port 9090!");
        console.log("DocSort is ready to use");
        if(config.mongodb.eraseOnStartup) {
            insertDummyData().then(() => {
                console.log("insertDummyData finished");
            });
        }
    });  
}

run();