import { RateLimit, TIME_UNIT } from "@discordx/utilities"
import googleTranslateApi from "@vitalets/google-translate-api"
import { ApplicationCommandType, EmbedBuilder, MessageContextMenuCommandInteraction } from "discord.js"
import { ContextMenu, Discord, Guard } from "discordx"
import { Emoji } from "../../utils/Emoji.js"

@Discord()
@Guard(RateLimit(TIME_UNIT.seconds, 5))
class Translator {

	@ContextMenu({
		name: "자동번역",
		type: ApplicationCommandType.Message
	})
	private async translate(
		interaction: MessageContextMenuCommandInteraction
	) {
		await interaction.deferReply({ ephemeral: false })

		//////////////////////////////
		// Get Message Content
		////////////////////
		const msg: string = await interaction.channel.messages.fetch(interaction.targetId).then(msg => msg.content)

		// msg not found
		if (!msg) {
			const msgNotFound = new EmbedBuilder()
				.setColor("Red")
				.setTitle(`${Emoji.FAIL} 번역할 수 없습니다.`)
				.setDescription("메시지를 찾을 수 없습니다. \`MessageNotFound\`")
			return await interaction.editReply({ embeds: [msgNotFound] })
		}

		// translate
		let translate = await googleTranslateApi(msg, { from: "auto", to: "en" })

		if (translate.from.language.iso == "en")
			translate = await googleTranslateApi(msg, { from: "auto", to: "ko" })

		const { iso } = translate.from.language
		const embed = new EmbedBuilder()
			.setColor("Green")
			.setTitle(`${Emoji.TRANSLATOR} 원본 메세지 확인하기 \`${iso}\` ➢ \`${iso == "en" ? "ko" : "en"}\``)
			.setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.targetId}`)
			.setDescription(translate.text)

		await interaction.editReply({ embeds: [embed] })
	}

}