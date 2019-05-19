import chalk from "chalk";

class LogManager {

    private logInfo: boolean;
    private logSuccess: boolean;
    private logWarn: boolean;
    private logError: boolean;

    constructor() {
        this.loadConfig();
    }

    private loadConfig() {
        // default config hardcoded
        this.logInfo = true;
        this.logSuccess = true;
        this.logWarn = true;
        this.logError = true;
    }

    info(text: string) {
        if(this.logInfo) {
            console.log(chalk.blueBright("-#-") + " " + text);
        }
    }

    success(text: string) {
        if(this.logSuccess) {
            console.log(chalk.greenBright("-#-") + " " + text);
        }
    }

    warn(text: string) {
        if(this.logWarn) {
            console.log(chalk.yellowBright("-#-") + " " + text);
        }
    }

    error(text: string) {
        if(this.logError) {
            console.log(chalk.redBright("-#-") + " " + text);
        }
    }

    exception(text: string) {
        if(this.logError) {
            console.log(chalk.bgRedBright("-#!-") + " " + text);
        }
    }
}

let log = new LogManager();

export { log };