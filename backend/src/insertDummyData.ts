import * as fs from "fs";

import { Tag } from "./models/tag/tag.model";
import { User } from "./models/user/user.model";
import { Document } from "./models/document/document.model";
import { generateFilePath } from "./lib/generateFilePath";
import { connection } from "mongoose";

export async function insertDummyData() {
    // Reset database first
    console.log("\t-> Reset database ...")
    await connection.db.dropDatabase();
    await connection.useDb('DocSort');

    // Create tags -----------------------------
    let tag_rechnung = new Tag();
    tag_rechnung.name = "rechnung";
    await tag_rechnung.save();

    let tag_mahnung = new Tag();
    tag_mahnung.name = "mahnung";
    await tag_mahnung.save();

    let tag_tui = new Tag();
    tag_tui.name = "tui";
    await tag_tui.save();

    let tag_warteAufAntwort = new Tag();
    tag_warteAufAntwort.name = "warte auf antwort";
    await tag_warteAufAntwort.save();

    // Create user_test -----------------------------
    let user_test = new User();
    user_test.username = "test";
    user_test.password = "pass";
    user_test.tags_R = new Array();
    user_test.tags_R.push(tag_warteAufAntwort, tag_rechnung, tag_mahnung, tag_tui);
    await user_test.save();
    fs.mkdirSync("./uploads/" + user_test.id)

    // Create user_brother -----------------------------
    let user_brother = new User();
    user_brother.username = "brother";
    user_brother.password = "pass2";
    user_brother.tags_R = new Array();
    user_brother.tags_R.push(tag_warteAufAntwort, tag_tui);
    await user_brother.save();
    fs.mkdirSync("./uploads/" + user_brother.id)

    // Create doc_1
    let doc_1 = new Document();
    doc_1.number = {};
    doc_1.number.primary = 1;
    doc_1.title = "tui rechnung";
    doc_1.note = "die rechnung zu tui";
    doc_1.fileExtension = "pdf";
    doc_1.user_R = user_test;
    doc_1.tags_R = new Array();
    doc_1.tags_R.push(tag_tui, tag_rechnung);
    doc_1.createdAt = new Date(2018, 7, 1);
    await doc_1.save();
    let doc_1_path = generateFilePath(doc_1);
    fs.copyFileSync("./_dummyFiles/2.pdf", doc_1_path);

    // Create doc_2
    let doc_2 = new Document();
    doc_2.number = {};
    doc_2.number.primary = 2;
    doc_2.title = "tui mahnung";
    doc_2.note = "leider ne mahnung bekommen...";
    doc_2.fileExtension = "pdf";
    doc_2.user_R = user_test;
    doc_2.tags_R = new Array();
    doc_2.tags_R.push(tag_tui, tag_mahnung);
    doc_2.createdAt = new Date(2018, 7, 14);
    await doc_2.save();
    let doc_2_path = generateFilePath(doc_2);
    fs.copyFileSync("./_dummyFiles/2.pdf", doc_2_path);

    // Create doc_3
    let doc_3 = new Document();
    doc_3.number = {};
    doc_3.number.primary = 3;
    doc_3.title = "tui mahnung - antwort";
    doc_3.note = "mein antwort-brief zur mahnung, warte auf antwort...";
    doc_3.fileExtension = "png";
    doc_3.user_R = user_brother;
    doc_3.tags_R = new Array();
    doc_3.tags_R.push(tag_tui, tag_mahnung, tag_warteAufAntwort);
    doc_3.createdAt = new Date(2018, 7, 16);
    await doc_3.save();
    let doc_3_path = generateFilePath(doc_3);
    fs.copyFileSync("./_dummyFiles/3.png", doc_3_path);

    console.log("all dummy-entries inserted");
}