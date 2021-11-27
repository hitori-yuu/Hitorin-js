const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let bot = '🤖ボット';
require('dotenv').config();
const version = process.env.VERSION;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('指定したものの詳細を表示します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('ボット', 'bot').addChoice('ユーザー', 'user').addChoice('メンバー', 'member').addChoice('サーバー', 'server'))
		.addUserOption(option => option.setName('対象').setDescription('ユーザーかメンバーを選択')),

	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		if (type === 'user') {
			const user = interaction.options.getUser('対象');
			if (!user.bot) bot = '👤ユーザー';
			const u = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('ユーザーの詳細')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${user.tag}\n**[ID]** ${user.id}\n**[種類]]** ${bot}` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(user.createdTimestamp).toLocaleDateString()}` },
				)
				.setThumbnail(user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [u] });
		}

		if (type === 'member') {
			const member = interaction.options.getMember('対象');
			if (!member.user.bot) bot = '👤ユーザー';
			const period = Math.round((Date.now() - member.joinedAt) / 86400000);
			let status = '🟢 オンライン 🟢';
			if (member.presence.status === 'idle') status = '🟡 退席中 🟡';
			else if (member.presence.status === 'dnd') status = '🔴 取組中 🔴';
			else if (member.presence.status === 'offline') status = '⚫ オフライン ⚫';
			const m = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('メンバーの詳細')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id}\n**[ニックネーム]]** ${member.nickname || 'None'}\n**[種類]** ${bot}` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(member.user.createdTimestamp).toLocaleDateString()}\n**[参加日]** ${new Date(member.joinedTimestamp).toLocaleDateString() || 'None'}\n**[参加期間]** ${period || 'None'} 日` },
					{ name: '__**ステータス:**__', value: `**[一般]** ${status || 'None'}` },
					{ name: '__**ロール:**__', value: `**[最上位ロール]**\n${member.roles.highest || 'None'}\n**[ロール (${member.roles.cache.size})]**\n${member.roles.cache.map(role => `${role}`).join(' , ') || 'None'}` },
				)
				.setThumbnail(member.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [m] });
		}

		if (type === 'server') {
			const server = interaction.guild;
			const members = interaction.guild.members.cache;
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('サーバーの詳細')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${server.name}\n**[ID]** ${server.id}\n**[作成者]** <@${server.ownerId}>` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(server.createdTimestamp).toLocaleDateString()}\n**[ボット参加日]** ${new Date(server.joinedTimestamp).toLocaleDateString()}` },
					{ name: '__**数量:**__', value: `**[メンバー数]** ${server.memberCount}(👤:${members.filter(member => !member.user.bot).size}, 🤖:${members.filter(member => member.user.bot).size})\n**[テキストチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size}\n**[ボイスチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size}\n**[絵文字数]** ${server.emojis.cache.size}\n**[ブースト数]** (${server.premiumSubscriptionCount || '0'} ブースト)` },
				)
				.setThumbnail(server.iconURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			interaction.reply({ embeds: [s] });
		}

		if (type === 'bot') {
			const author = client.users.cache.get('874184214130602015');
			const b = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Bot Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${client.user.tag}\n**[ID]** ${client.user.id}\n**[作成者]** <@${author.id}>` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(client.user.createdTimestamp).toLocaleDateString()}` },
					{ name: '__**バージョン:**__', value: `**[ボット]** ${version}\n**[使用言語]** discord.js@${require('discord.js').version}` },
					{ name: '__**ステータス:**__', value: `**[反応速度]** ws:${client.ws.ping}ms\n**[サーバー数]** ${client.guilds.cache.size} サーバー\n**[ユーザー数]** ${client.users.cache.size} ユーザー` },
				)
				.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [b] });
		}
	},
};