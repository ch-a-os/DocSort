import * as fs from 'fs';
import { Mongoose } from "mongoose";
//import { insertDummyData } from './dummyData';
import { registerExpressRoutes } from './lib/registerExpressRoutes';
import createExpressServer from './lib/createExpressServer';
import { config } from './config';
import { User } from './models/user/user.model';

const mongoose: Mongoose = require("mongoose");

async function run() {
    console.log("DocSort is starting, please stand by ...");

    // todo: clean db
    console.log("- database cleaned");

    if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
    }
    console.log("- uploads-folder existing");
    
    // Create connection to MongoDB
    try {
        mongoose.set("bufferCommands", false); // Disable Command-Buffering (DEV-MODE)
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        console.log("connect to db");
        await mongoose.connect(config.mongodb);
        console.log("connected to db");
    } catch (error) {
        console.log("There is an error while connection to the database:", error);
        process.exit(1);
    }
    console.log("- connected to database");

    // Create Express server
    const { app, server } = createExpressServer();

    // todo: await insertDummyData();
    console.log("- dummydata inserted");

    // Register routes
    registerExpressRoutes(app);
    console.log("- routes registered");

    // Start server
    server.listen(9090, () => {
        console.log("- Server started on port 9090!");
        console.log("DocSort is ready to use");
        let user = new User();
        user.username = "test";
        user.password = "123";
        user.save().then(() => {
            console.log("test-user erstellt");
        });
    });  
}
run();