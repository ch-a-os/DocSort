import * as fs from "fs";

import { Tag } from "./models/tag/tag.model";
import { User } from "./models/user/user.model";
import { Document } from "./models/document/document.model";
import { generateFilePath } from "./lib/generateFilePath";
import { connection } from "mongoose";
import { getNextPrimaryNumber } from "./lib/getNextPrimaryNumber";

export async function insertDummyData() {
    // Reset database first
    console.log("\t-> Reset database ...")
    await connection.db.dropDatabase();
    await connection.useDb('DocSort');

    // Create tags -----------------------------
    let tagInvoice = await Tag.create({
        name: "Invoice",
        colorBackground: "#f1c40f",
        colorForeground: '#ffffff'
    });
    await tagInvoice.save();

    let tagWarning = await Tag.create({
        name: "Warning"
    });
    await tagWarning.save();

    let tagTravel = await Tag.create({
        name: "Travel",
        colorBackground: "#2ecc71",
        colorForeground: '#ffffff'
    });
    await tagTravel.save();

    let tagTUI = await Tag.create({
        name: "tui"
    });
    await tagTUI.save();

    let tagWaitForReponse = await Tag.create({
        name: "wait for response"
    });
    await tagWaitForReponse.save();

    let tagMisc = await Tag.create({
        name: "Misc",
        colorBackground: "#1c1c1c",
        colorForeground: "#ffffff"
    });
    await tagMisc.save();

    // Create user_test -----------------------------
    let user_test = new User();
    user_test.username = "test";
    user_test.password = "pass";
    user_test.tags_R = new Array();
    user_test.tags_R.push(tagWaitForReponse, tagInvoice, tagWarning, tagTUI);
    await user_test.save();
    fs.mkdirSync("./uploads/" + user_test.id)

    // Create user_brother -----------------------------
    let user_brother = new User();
    user_brother.username = "brother";
    user_brother.password = "pass2";
    user_brother.tags_R = new Array();
    user_brother.tags_R.push(tagWaitForReponse, tagTUI);
    await user_brother.save();
    fs.mkdirSync("./uploads/" + user_brother.id)

    const documents = [
        {
            primaryNumber: 1,
            secondaryNumber: 0,
            title: "Sample document 1 - Watermarked",
            note: "What the title says",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc],
            createdAt: new Date(2018, 4, 26)
        },
        {
            primaryNumber: 2,
            secondaryNumber: 0,
            title: "Sample document 2",
            note: "This is cool text",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagWarning, tagInvoice],
            createdAt: new Date(2018, 4, 27)
        },
        {
            primaryNumber: 3,
            secondaryNumber: 0,
            title: "Sample document 3",
            note: "$4.500 :(",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagTravel, tagInvoice],
            createdAt: new Date(2018, 4, 27)
        },
        {
            primaryNumber: 4,
            secondaryNumber: 0,
            title: "Sample document 4 awww",
            note: "Awwww",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc],
            createdAt: new Date(2018, 5, 10)
        },
        {
            primaryNumber: 5,
            secondaryNumber: 0,
            title: "Sample document 5",
            note: "Did you????",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice, tagWarning],
            createdAt: new Date(2018, 5, 30)
        },
        {
            primaryNumber: 5,
            secondaryNumber: 1,
            title: "Sample document 6 - Magic",
            note: "Right?",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc, tagWarning],
            createdAt: new Date(2018, 7, 6)
        },
        {
            primaryNumber: 5,
            secondaryNumber: 2,
            title: "Sample document 7",
            note: "More magic",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice, tagMisc, tagTravel, tagWarning],
            createdAt: new Date(2018, 7, 14)
        },
        {
            primaryNumber: 6,
            secondaryNumber: 0,
            title: "Can you OCR?",
            note: "[Fill in here a good note]",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags: [tagInvoice],
            createdAt: new Date(2018, 9, 11)
        },
        {
            primaryNumber: 7,
            secondaryNumber: 0,
            title: "Sample document 9 - Base64",
            note: "Bipp, boop, bipp",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags: [tagMisc, tagWarning],
            createdAt: new Date(2018, 9, 31)
        },
        {
            primaryNumber: 8,
            secondaryNumber: 0,
            title: "Sample document 10",
            note: "Funny joke",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagTravel],
            createdAt: new Date(2018, 12, 3)
        },
        {
            primaryNumber: 9,
            secondaryNumber: 0,
            title: "Sample document 11",
            note: "ftw!!!!!!",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice],
            createdAt: new Date(2019, 1, 12)
        },
        {
            primaryNumber: 10,
            secondaryNumber: 0,
            title: "Sample document 12 - pnnnnnnnng",
            note: "PDF is boring, now PNG.",
            fileExtension: 'png',
            user_R: user_test,
            tags: [tagMisc, tagInvoice],
            createdAt: new Date(2019, 2, 17)
        },
        {
            primaryNumber: 11,
            secondaryNumber: 0,
            title: "Sample document 13",
            note: "Be brave.",
            fileExtension: 'png',
            user_R: user_brother,
            tags: [tagInvoice],
            createdAt: new Date(2019, 3, 16)
        },
        {
            primaryNumber: 12,
            secondaryNumber: 0,
            title: "Sample document 14 - DigiDoc",
            note: "Can be cool name too",
            fileExtension: 'jpg',
            user_R: user_brother,
            tags: [tagInvoice, tagWarning],
            createdAt: new Date(2019, 3, 16)
        }
    ]

    console.log("Begin to save all dummy documents ...")
    for(let i = 0; i < documents.length; i++) {
        const document = documents[i];
        const db = await Document.create(document);
        await db.save();
        console.log(`Document ${i} of ${documents.length} has been saved.`)
    }

    // Create doc_1
    let doc_1 = new Document();
    doc_1.number = {};
    doc_1.number.primary = await getNextPrimaryNumber(doc_1._id);
    doc_1.title = "tui rechnung";
    doc_1.note = "die rechnung zu tui";
    doc_1.fileExtension = "pdf";
    doc_1.user_R = user_test;
    doc_1.tags_R = new Array();
    doc_1.tags_R.push(tagTUI, tagInvoice);
    doc_1.createdAt = new Date(2018, 7, 1);
    await doc_1.save();
    let doc_1_path = generateFilePath(doc_1);
    fs.copyFileSync("./_dummyFiles/2.pdf", doc_1_path);

    // Create doc_2
    let doc_2 = new Document();
    doc_2.number = {};
    doc_2.number.primary = await getNextPrimaryNumber(doc_1._id);
    doc_2.title = "tui mahnung";
    doc_2.note = "leider ne mahnung bekommen...";
    doc_2.fileExtension = "pdf";
    doc_2.user_R = user_test;
    doc_2.tags_R = new Array();
    doc_2.tags_R.push(tagTUI, tagWarning);
    doc_2.createdAt = new Date(2018, 7, 14);
    await doc_2.save();
    let doc_2_path = generateFilePath(doc_2);
    fs.copyFileSync("./_dummyFiles/2.pdf", doc_2_path);

    // Create doc_3
    let doc_3 = new Document();
    doc_3.number = {};
    doc_3.number.primary = await getNextPrimaryNumber(doc_1._id);
    doc_3.title = "tui mahnung - antwort";
    doc_3.note = "mein antwort-brief zur mahnung, warte auf antwort...";
    doc_3.fileExtension = "png";
    doc_3.user_R = user_brother;
    doc_3.tags_R = new Array();
    doc_3.tags_R.push(tagTUI, tagWarning, tagWaitForReponse);
    doc_3.createdAt = new Date(2018, 7, 16);
    await doc_3.save();
    let doc_3_path = generateFilePath(doc_3);
    fs.copyFileSync("./_dummyFiles/3.png", doc_3_path);

    console.log("all dummy-entries inserted");
}