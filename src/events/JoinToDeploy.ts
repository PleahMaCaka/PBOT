import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
class JoinToDeploy {

	@On({ event: "guildCreate" })
	private async guildCreate(
		[guild]: ArgsOf<"guildCreate">,
		client: Client
	) {
		await client.guilds.fetch()
		await client.initGuildApplicationCommands(guild.id, client.applicationCommands.map(cmd => cmd))
		console.log(`new guild : ${guild.name}`)
	}

}