import * as jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { IUser } from '../models/user/user.interface';
import { User } from '../models/user/user.model';
import { createPasswordHash } from '../lib/security';
import { configManager } from '../app';
import { log } from '../lib/logging';
import { formatError, ApplicationError, ERROR } from '../lib/errorHandler';

export default async function login(req: Request, res: Response) {
    try {
        const username = req.header("username");
        const password = req.header("password");

        if(username == null || password == null) {
            res.status(400).send();
            return;
        }

        const user: IUser = await User.findOne({ username: username }).exec();

        //@ts-ignore
        console.log(a.gggf)
        //new ApplicationError(ERROR.NotFoundError, null, res);

        if(user == null) {
            res.status(404).send();
            return;
        }

        const hashedPassword = await createPasswordHash(password, user.salt);
        log.info("login: hashedPassword=" + hashedPassword);
        if(user.password == hashedPassword) {
            log.success(`User ${username} is now logged in.`);

            const jwtBody = {
                id: user.id,
                username: user.username
            }
            const jsonWebToken = jwt.sign(jwtBody, configManager.config.secretJWT, { expiresIn: '7d' });
            res.status(200).send({
                jwt: jsonWebToken
            });
            return;
        }
        res.status(401).send();
    } catch(err) {
        if(res.headersSent) formatError(err);
        else {
            formatError(new ApplicationError(ERROR.UncaughtError, err.message, res));
        }
    }
}