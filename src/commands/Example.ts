import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {

	@Slash({ name: "example" })
	private async example(interaction: CommandInteraction) {
		await interaction.reply("hello!")
	}

}