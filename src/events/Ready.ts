import type { ArgsOf } from "discordx"
import { Client, Discord, Once } from "discordx"

@Discord()
export class Ready {

	@Once({ event: "ready" })
	private async ready(
		[ready]: ArgsOf<"ready">,
		client: Client
	) {
		await client.guilds.fetch()
		await client.initApplicationCommands()
	}

}