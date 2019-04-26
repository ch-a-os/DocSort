import { log } from './logging';
import chalk from 'chalk';

export async function errorHandler(err: Error) {
    console.log("")
    log.error(`${chalk.redBright("================= [ ERROR ] =================")}`)
    log.error(`${chalk.bold("Something unexpected happend (╯°□°）╯︵ ┻━┻")}`)
    log.error(`${chalk.bold("Please report the following error by creating an issue on GitHub:")}`)
    log.error(`${err.stack}`)
    log.error(`${chalk.bold("Please following our guide on how to create a helpful bug report here: COMING SOON")}`)
    log.error(`${chalk.redBright("================== [ END ] ==================")}`)
    console.log("")
}