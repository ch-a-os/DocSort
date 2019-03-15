import * as fs from 'fs';
import { Mongoose } from "mongoose";
//import { insertDummyData } from './dummyData';
import { registerExpressRoutes } from './lib/registerExpressRoutes';
import createExpressServer from './lib/createExpressServer';
import { config } from './config';
import { User } from './models/user/user.model';
import { insertDummyData } from './insertDummyData';
import * as del from "del";

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
        await mongoose.connect(config.mongodb);
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
        insertDummyData().then(() => {
            console.log("insertDummyData finished");
        });
    });  
}

/*var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };*/

run();