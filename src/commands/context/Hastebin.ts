import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import axios from "axios";
import {
	ActionRowBuilder,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	ContextMenuCommandInteraction,
	EmbedBuilder,
	MessageActionRowComponentBuilder
} from "discord.js";
import { ContextMenu, Discord, Guard } from "discordx";
import { Emoji } from "../../utils/Emoji";

@Discord()
@Guard(RateLimit(
	TIME_UNIT.seconds, 5,
	{ ephemeral: true, message: "5초에 한번만 사용할 수 있습니다." }
))
export abstract class Hastebin {

	@ContextMenu({
		name: "≫ HASTEBIN ≪",
		type: ApplicationCommandType.Message
	})
	private async userHandler(interaction: ContextMenuCommandInteraction) {
		await interaction.deferReply()

		const message = await interaction.channel!!.messages.fetch(interaction.targetId)

		// no content
		if (message.content === undefined || message.content.length === 0) {
			const tooShortEmbed = new EmbedBuilder()
				.setTitle(`${Emoji.FAIL} 업로드 실패!`)
				.setDescription("임베드, 이미지, 파일(준비중)등은 업로드가 불가합니다.")
				.setColor("Red")
			return await interaction.editReply({ embeds: [tooShortEmbed] })
		}

		// request!
		const res = await axios({
			method: "POST",
			url: "https://hastebin.com/documents/",
			data: message.content
		})

		// request fail
		if (res.status !== 200) {
			const errorEmbed = new EmbedBuilder()
				.setTitle(`${Emoji.FAIL} 업로드 실패!`)
				.setDescription(`Code: ${res.status}, 다시 시도 후 실패 시 관리자에게 문의하세요. \`/문의\``)
				.setColor("Red")
			return await interaction.editReply({ embeds: [errorEmbed] })
		}

		// SUCCESS
		if (res.status === 200) {
			const { guildId, channelId, targetId, user } = interaction

			const successEmbed = new EmbedBuilder()
				.setTitle(`${Emoji.SUCCESS} 업로드 성공!`)
				.setDescription(`
					아래 버튼을 눌러 확인하세요. \`${res.data.key}\`
					<@${user.id}> » [저장된 메세지](https://discord.com/channels/${guildId}/${channelId}/${targetId})
				`)
				.setColor("Green")

			const gotoBtn = new ButtonBuilder()
				.setURL(`https://hastebin.com/${res.data.key}`)
				.setStyle(ButtonStyle.Link)
				.setLabel("확인하기")

			const gotoRawBtn = new ButtonBuilder()
				.setURL(`https://hastebin.com/raw/${res.data.key}`)
				.setStyle(ButtonStyle.Link)
				.setLabel("원시 데이터")

			const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
				.addComponents(gotoBtn, gotoRawBtn)

			return await interaction.editReply({ embeds: [successEmbed], components: [row] })
		}
	}

}