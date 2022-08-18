import chalk from "chalk";

export class Log {
    static info(...args) {
        console.log(chalk.yellow(args.join(" ")));
    }

    static error(...args) {
        console.log(chalk.red(args.join(" ")));
    }
}