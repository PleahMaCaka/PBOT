import { importx } from "@discordx/importer"
import { IntentsBitField } from "discord.js"
import { Client } from "discordx"
import "dotenv/config"
import "reflect-metadata"

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
	silent: false,
})


async function run() {
	await importx(__dirname + "/{events,commands}/**/*.{ts,js}")

	if (!process.env.TOKEN)
		throw new Error("Cannot find TOKEN in your environment")

	await client.login(process.env.TOKEN)
}

run()