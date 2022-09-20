import { ApplicationCommandType, EmbedBuilder, MessageContextMenuCommandInteraction } from "discord.js"
import { ContextMenu, Discord, Guild } from "discordx"
import 'dotenv/config'
import { inspect } from "util";

@Discord()
@Guild(process.env.ADMIN_GUILD)
class Evaluate {

	@ContextMenu({
		name: "≫ :: EVALUATE :: ≪",
		type: ApplicationCommandType.Message
	})
	private async evaluate(
		interaction: MessageContextMenuCommandInteraction
	) {
		await interaction.deferReply({ ephemeral: (process.env.ADMIN_GUILD !== interaction.guildId) })

		// check permission
		if (process.env.ADMIN_ID != interaction.user.id)
			return await interaction.editReply("You are not owner of this bot")

		// fetch message
		let msg: string = await interaction.channel.messages.fetch(interaction.targetId).then(msg => msg.content)

		// message not found
		if (!msg) return await interaction.editReply("Message not found")

		// remove backticks
		// do not use /`/g, remove only the backticks at both ends
		if (msg.startsWith("```") && msg.endsWith("```")) {
			for (let i = 0; i < 2; i++) {
				msg = msg.replace("```", "")
					.split("").reverse().join("")
			}
		} else return await interaction.editReply("Not a codeblock")


		let result: any
		const keywords = [{ js: ["js", "javascript"] }, { ts: ["ts", "typescript"] }]
		const lang = msg.split("\n")[0].toLowerCase()

		let evalLang: string | void
		keywords.forEach(langObject => {
			for (const [key, value] of Object.entries(langObject)) {
				if (value.includes(lang)) return evalLang = key
			}
		})

		msg = msg.split(lang).pop()
		switch (evalLang) {
			case 'js':
				result = await eval(msg)
				break
			case "ts":
				result = await eval(require("typescript").transpile(msg))
				break
			default:
				return await interaction.editReply("Not available language")
		}
		inspect(result, { depth: 0 })

		if (result === undefined) result = "undefined"
		if (result === null) result = "null"
		else result = result as unknown as string

		(result as string).replaceAll(process.env.TOKEN, "TOKEN")

		const embed = new EmbedBuilder()
			.setTitle("Evaluate")
			.setColor("#bc92ff")
			.addFields(
				{ name: ":inbox_tray: **INPUT**", value: `\`\`\`${evalLang}\n${msg}\`\`\``, inline: false },
				{ name: ":outbox_tray: **OUTPUT**", value: `${String(result)}`, inline: false }
			)

		await interaction.editReply({ embeds: [embed] })

	}

}