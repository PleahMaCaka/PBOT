import "dotenv/config"
import { DEBUG } from "../start"

/**
 * Original Source:
 * https://github.com/PleahMaCaka/Logger-P/
 */

export enum Level {
	"INFO",
	"WARN",
	"ERROR",
	"DEBUG",
	"CRITICAL"
}

export type LogType = "INFO" | "WARN" | "ERROR" | "DEBUG" | "CRITICAL"

const color = {
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	white: "\x1b[37m",
	bold: "\x1b[1m",
	reset: "\x1b[0m"
}

function getDate(): string {
	const date: Date = new Date()
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class Logger {

	static log(type?: Level | LogType, ...content: any): void {
		/**
		 * @param type Specifies the log type. Be like: Level.INFO
		 * @param content any type, is the content to be logged.
		 */

		// if not have type argument, forced config to INFO
		if (type === undefined || null) type = Level.INFO

		// Converts LogType to Level, which is an Enum
		if (type === "INFO") type = Level.INFO
		if (type === "WARN") type = Level.WARN
		if (type === "ERROR") type = Level.ERROR
		if (type === "DEBUG") type = Level.DEBUG
		if (type === "CRITICAL") type = Level.CRITICAL

		switch (type) {
			case Level.INFO:
				return this.infoLog(content)

			case Level.WARN:
				return this.warnLog(content)

			case Level.ERROR:
				return this.errorLog(content)

			case Level.DEBUG:
				if (DEBUG) return this.debugLog(content)
				else return

			case Level.CRITICAL:
				return this.criticalLog(content)

			default:
				throw new TypeError("The logger must be of one of the following types: INFO, WARN, ERROR, DEBUG, CRITICAL")
		}
	}

	private static infoLog(...content: string | any): void {
		return console.info(color.green, `[${getDate()}] :: [INFO] :: ${content}`, color.reset)
	}

	private static warnLog(...content: string | any): void {
		return console.warn(color.yellow, `[${getDate()}] :: [WARN] :: ${content}`, color.reset)
	}

	private static errorLog(...content: string | any): void {
		return console.error(color.red, `[${getDate()}] :: [ERROR] :: ${content}`, color.reset)
	}

	private static debugLog(...content: string | any): void {
		if (DEBUG) return console.debug(color.blue, `[${getDate()}] :: [DEBUG] :: ${content}`, color.reset)
		else return
	}

	private static criticalLog(...content: string | any): void {
		console.log(color.red + color.bold, "======================================================================", color.reset)
		console.error(color.red + color.bold, `[${getDate()}] :: [CRITICAL] :: ${content}`, color.reset)
		console.log(color.red + color.bold, "======================================================================", color.reset)
		return
	}

}