import { dirname, importx } from "@discordx/importer"
import { IntentsBitField } from "discord.js"
import { Client } from "discordx"
import "dotenv/config"
import "reflect-metadata"
import { Logger } from "./utils/Logger.js"

export const DEBUG = !!(process.env.DEBUG == "true" || "True" || "TRUE") // none = false

export const client = new Client({
	botGuilds: [client => client.guilds.cache.map(guild => guild.id)],
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildBans,
		IntentsBitField.Flags.GuildEmojisAndStickers,
		IntentsBitField.Flags.GuildIntegrations,
		IntentsBitField.Flags.GuildWebhooks,
		IntentsBitField.Flags.GuildInvites,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMessageTyping,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.DirectMessageReactions,
		IntentsBitField.Flags.DirectMessageTyping,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildScheduledEvents
	],
	silent: !DEBUG,
})


async function run() {
	await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
	// await importx(__dirname + "/{events,commands}/**/*.{ts,js}")

	if (!process.env.TOKEN)
		throw new Error("Cannot find TOKEN in your environment")

	if (DEBUG) Logger.log("DEBUG", "!!!DEBUG MODE IS ENABLED!!!")

	await client.login(process.env.TOKEN)
}

await run()