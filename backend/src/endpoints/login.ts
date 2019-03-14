import * as jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { IUser } from '../models/user/user.interface';
import { User } from '../models/user/user.model';
import { createPasswordHash } from '../lib/createPasswordHash';
import { config } from '../config';

export default async function login(req: Request, res: Response) {
    const username = req.header("username");
    const password = req.header("password");

    if(username == null || password == null) {
        res.status(400).send();
        return;
    }

    const user: IUser = await User.findOne({ username: username }).exec();

    if(user == null) {
        res.status(404).send();
        return;
    }

    const hashedPassword = await createPasswordHash(password, user.salt);
    if(user.password == hashedPassword) {
        console.log(`User ${username} is now logged in.`);

        const jwtBody = {
            id: user.id,
            username: user.username
        }
        const jsonWebToken = jwt.sign(jwtBody, config.secretJWT, { expiresIn: '7d' });
        res.status(200).send({
            jwt: jsonWebToken
        });
        return;
    }
    res.status(401).send();
}