import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	MessageActionRowComponentBuilder
} from "discord.js"
import { ButtonComponent, Client, Discord, Slash, SlashGroup } from "discordx"
import 'dotenv/config'

@Discord()
@SlashGroup({
	name: "봇",
	description: "봇에 대한 정보를 확인하세요!"
})
export class Information {

	@Slash({ name: "초대", description: "봇을 초대하세요!" })
	@SlashGroup("봇")
	private async invite(
		interaction: CommandInteraction,
		client: Client
	) {
		const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`

		const embed = new EmbedBuilder()
			.setTitle(":love_letter: 초대하기")
			.setDescription(`아래의 버튼 또는 [여기](${link})를 눌러 초대하세요!`)
			.setColor("Green")

		const inviteBtn = new ButtonBuilder()
			.setURL(link)
			.setStyle(ButtonStyle.Link)
			.setLabel("초대하기")

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(inviteBtn)

		await interaction.reply({ embeds: [embed], components: [row] })
	}

	@Slash({ name: "상태", description: "봇의 상태를 확인하세요!" })
	@SlashGroup("봇")
	private async status(
		interaction: CommandInteraction,
		client: Client
	) {
		await interaction.deferReply()

		const embed = new EmbedBuilder()
			.setTitle("상태(Status)")
			.addFields(
				{ name: "Bot Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: "API Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true }
			)

		await interaction.editReply({ embeds: [embed] })

		if (interaction.user.id === process.env.ADMIN_ID) {
			const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setLabel("More Information")
						.setStyle(ButtonStyle.Success)
						.setCustomId("admin-status")
				)

			return await interaction.followUp({ ephemeral: true, components: [row] })
		}
	}

	@Slash({ name: "정보", description: "봇에 대한 정보를 확인하세요!" })
	@SlashGroup("봇")
	private async aboutSlash(
		interaction: CommandInteraction,
		client: Client
	) {
		const about = new EmbedBuilder()
			.setColor("#bc92ff")
			.setTitle(`:thought_balloon: About ${client.user!.username}`)
			.setDescription(`다른 서버에 초대하고 싶나요? \`/봇 초대\``)
			.setThumbnail("https://cdn.discordapp.com/attachments/982752265418977320/982752400135819274/TS_LOGO.png")
			.addFields(
				{ name: "공식 문서", value: "준비중 (GitBook)", inline: true },
				{ name: "지원 서버", value: "[접속하기](https://discord.gg/YGmyFer)", inline: true },
				{ name: "개발자", value: process.env.ADMIN_ID, inline: true }
			)

		const githubBtn = new ButtonBuilder()
			.setURL("https://github.com/PleahMaCaka/pbot")
			.setStyle(ButtonStyle.Link)
			.setLabel("Github")

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(githubBtn)

		await interaction.reply({ embeds: [about], components: [row] })
	}

	//////////////////////////////
	// Admin Status Interaction
	////////////////////
	@ButtonComponent({ id: "admin-status" })
	private async adminStatusBtn(interaction: ButtonInteraction) {
		const moreInfoEmbed = new EmbedBuilder()
			.setTitle("Admin Information")
			.setColor("Green")

		const memory: NodeJS.MemoryUsage = process.memoryUsage()

		for (let key of Object.keys(memory)) {
			moreInfoEmbed.addFields({
					name: key, inline: true,
					value: `${(memory[key as keyof typeof memory] / 1024 / 1024 * 100).toFixed()} MB`,
				}
			)
		}

		await interaction.reply({ ephemeral: true, embeds: [moreInfoEmbed] })
	}

}