import { Document } from "./entity/document";
import { Tag } from "./entity/tag";
import { User } from "./entity/user";
import { createRandomString } from "./libs/createRandomString";
import { createPasswordHash } from "./libs/createPasswordHash";


export async function insertDummyData() {
    // Declare dummy users
    const dummyUsers: Array<any> = [
        {
            username: "test",
            password: "test"
        },
        {
            username: "test2",
            password: "test2"
        }
    ]

    // Write dummy users into database
    for(let dummyUser of dummyUsers) {
        const salt: string = createRandomString(16);
        const hashedPW: string = await createPasswordHash(dummyUser.password, salt);

        await User.create({
            username: dummyUser.username,
            password: hashedPW,
            salt: salt
        }).save();
    }
    let test: User = await User.findOne({where: {username: "test"}});
    let test2: User = await User.findOne({where: {username: "test2"}});

    // Create tags
    const tagInvoice = await Tag.create({
        name: "Invoice",
        colorBackground: "#f1c40f",
        colorForeground: '#ffffff',
        user: test
    }).save();
    const tagTravel = await Tag.create({
        name: "Travel",
        colorBackground: "#2ecc71",
        colorForeground: '#ffffff',
        user: test
    }).save();
    const tagWarning = await Tag.create({
        name: "Warning",
        colorBackground: "#e74c3c",
        colorForeground: "#ffffff",
        user: test
    }).save();
    const tagMisc = await Tag.create({
        name: "Misc",
        colorBackground: "#1c1c1c",
        colorForeground: "#ffffff",
        user: test
    }).save();

    const documents = [
        {
            primaryNumber: 1,
            secondaryNumber: 0,
            title: "Sample document 1 - Watermarked",
            note: "What the title says",
            fileExtension: 'pdf',
            user: test,
            tags: [tagMisc]
        },
        {
            primaryNumber: 2,
            secondaryNumber: 0,
            title: "Sample document 2",
            note: "This is cool text",
            fileExtension: 'pdf',
            user: test,
            tags: [tagWarning, tagInvoice]
        },
        {
            primaryNumber: 3,
            secondaryNumber: 0,
            title: "Sample document 3",
            note: "$4.500 :(",
            fileExtension: 'pdf',
            user: test,
            tags: [tagTravel, tagInvoice]
        },
        {
            primaryNumber: 4,
            secondaryNumber: 0,
            title: "Sample document 4 awww",
            note: "Awwww",
            fileExtension: 'pdf',
            user: test,
            tags: [tagMisc]
        },
        {
            primaryNumber: 5,
            secondaryNumber: 0,
            title: "Sample document 5",
            note: "Did you????",
            fileExtension: 'pdf',
            user: test,
            tags: [tagInvoice, tagWarning]
        },
        {
            primaryNumber: 5,
            secondaryNumber: 1,
            title: "Sample document 6 - Magic",
            note: "Right?",
            fileExtension: 'pdf',
            user: test,
            tags: [tagMisc, tagWarning]
        },
        {
            primaryNumber: 5,
            secondaryNumber: 2,
            title: "Sample document 7",
            note: "More magic",
            fileExtension: 'pdf',
            user: test,
            tags: [tagInvoice, tagMisc, tagTravel, tagWarning]
        },
        {
            primaryNumber: 6,
            secondaryNumber: 0,
            title: "Can you OCR?",
            note: "[Fill in here a good note]",
            fileExtension: 'pdf',
            user: test2,
            tags: [tagInvoice]
        },
        {
            primaryNumber: 7,
            secondaryNumber: 0,
            title: "Sample document 9 - Base64",
            note: "Bipp, boop, bipp",
            fileExtension: 'pdf',
            user: test2,
            tags: [tagMisc, tagWarning]
        },
        {
            primaryNumber: 8,
            secondaryNumber: 0,
            title: "Sample document 10",
            note: "Funny joke",
            fileExtension: 'pdf',
            user: test,
            tags: [tagTravel]
        },
        {
            primaryNumber: 9,
            secondaryNumber: 0,
            title: "Sample document 11",
            note: "ftw!!!!!!",
            fileExtension: 'pdf',
            user: test,
            tags: [tagInvoice]
        },
        {
            primaryNumber: 10,
            secondaryNumber: 0,
            title: "Sample document 12 - pnnnnnnnng",
            note: "PDF is boring, now PNG.",
            fileExtension: 'png',
            user: test,
            tags: [tagMisc, tagInvoice]
        },
        {
            primaryNumber: 11,
            secondaryNumber: 0,
            title: "Sample document 13",
            note: "Be brave.",
            fileExtension: 'png',
            user: test2,
            tags: [tagInvoice]
        }
    ]

    // Save documents
    console.log("Begin to save all dummy documents ...")
    for(let i = 0; i < documents.length; i++) {
        const document = documents[i];
        await Document.create(document).save();
        console.log(`Document ${i} of ${documents.length} has been saved.`)
    }
}