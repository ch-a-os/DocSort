import * as fs from "fs";

import { Tag } from "./models/tag/tag.model";
import { User } from "./models/user/user.model";
import { Document } from "./models/document/document.model";
import { connection } from "mongoose";
import { generateFilePath } from "./lib/documentOperations";
import { getNextPrimaryNumber } from "./lib/userUtils";
import { log } from "./lib/logging";

export async function insertDummyData() {

    await connection.db.dropDatabase();
    await connection.useDb('DocSort');
    log.info("Database was resetted");

    // Create tags -----------------------------
    let tagInvoice = await Tag.create({
        name: "Invoice",
        style: {
            colorBackground: "#f1c40f",
            colorForeground: '#ffffff'
        }
    });
    await tagInvoice.save();

    let tagWarning = await Tag.create({
        name: "Warning"
    });
    await tagWarning.save();

    let tagTravel = await Tag.create({
        name: "Travel",
        style: {
            colorBackground: "#2ecc71",
            colorForeground: '#ffffff'
        }
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
        style: {
            colorBackground: "#1c1c1c",
            colorForeground: "#ffffff"
        }
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

    const documents: Array<any> = [
        {
            title: "Sample document 1 - Watermarked",
            note: "What the title says",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc],
            marked: true,
            createdAt: new Date(2018, 4, 26)
        },
        {
            title: "Sample document 2",
            note: "This is cool text",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagWarning, tagInvoice],
            createdAt: new Date(2018, 4, 27)
        },
        {
            title: "Sample document 3",
            note: "$4.500 :(",
            fileExtension: 'png',
            user_R: user_test,
            tags: [tagTravel, tagInvoice],
            marked: true,
            createdAt: new Date(2018, 4, 27)
        },
        {
            title: "Sample document 4 awww",
            note: "Awwww",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc],
            createdAt: new Date(2018, 5, 10)
        },
        {
            title: "Sample document 5",
            note: "Did you????",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice, tagWarning],
            createdAt: new Date(2018, 5, 30)
        },
        {
            title: "Sample document 6 - Magic",
            note: "Right?",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc, tagWarning],
            createdAt: new Date(2018, 7, 6)
        },
        {
            title: "Sample document 7",
            note: "More magic",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice, tagMisc, tagTravel, tagWarning],
            createdAt: new Date(2018, 7, 14)
        },
        {
            title: "Can you OCR?",
            note: "[Fill in here a good note]",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags: [tagInvoice],
            createdAt: new Date(2018, 9, 11)
        },
        {
            title: "Sample document 9 - Base64",
            note: "Bipp, boop, bipp",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags: [tagMisc, tagWarning],
            createdAt: new Date(2018, 9, 31)
        },
        {
            title: "Sample document 10",
            note: "Funny joke",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagTravel],
            createdAt: new Date(2018, 12, 3)
        },
        {
            title: "Sample document 11",
            note: "ftw!!!!!!",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagInvoice],
            createdAt: new Date(2019, 1, 12)
        },
        {
            title: "Sample document 12 - pnnnnnnnng",
            note: "PDF is boring, now PNG.",
            fileExtension: 'pdf',
            user_R: user_test,
            tags: [tagMisc, tagInvoice],
            createdAt: new Date(2019, 2, 17)
        },
        {
            title: "Sample document 13",
            note: "Be brave.",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags: [tagInvoice],
            createdAt: new Date(2019, 2, 6)
        },
        {
            title: "Sample document 14 - DigiDoc",
            note: "Can be cool name too",
            fileExtension: 'pdf',
            user_R: user_brother,
            tags_R: [tagInvoice, tagWarning],
            createdAt: new Date(2019, 2, 7)
        },
        {
            title: "Sample document 15 - Rechnung $50.450!!",
            note: "xD",
            fileExtension: 'png',
            user_R: user_brother,
            tags_R: [tagInvoice, tagTUI],
            createdAt: new Date(2019, 2, 7)
        },
        {
            title: "Sample document 16 - Die hassen mich",
            note: "lel",
            fileExtension: 'png',
            user_R: user_brother,
            tags_R: [tagWarning, tagTUI],
            createdAt: new Date(2019, 2, 14)
        },
        {
            title: "Sample document 17 - Sind die blöd????",
            note: "Looooooooooooooooooooooooooooooooooooooooooong",
            fileExtension: 'jpg',
            user_R: user_brother,
            tags_R: [tagWaitForReponse, tagTUI],
            marked: true,
            createdAt: new Date(2019, 2, 16)
        }
    ]

    log.info("Saving dummy documents...")
    for(let i = 0; i < documents.length; i++) {
        const document = documents[i];
        document.number = {};
        document.number.primary = await getNextPrimaryNumber(document.user_R._id);
        const db = await Document.create(document);

        // Copy file into uploads/{USER ID}/
        const docPath = generateFilePath(db);
        fs.copyFileSync(`./_dummyFiles/${i+1}.${document.fileExtension}`, docPath);

        log.info(`\tDocument ${i} of ${documents.length} has been saved (primary: ${document.number.primary}, userId: ${document.user_R._id})`)
    }
}