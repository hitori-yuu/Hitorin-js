const { SlashCommandBuilder } = require('@discordjs/builders');
const cooldown = new Set();
const profileModel = require('../models/profileSchema');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-coin')
		.setDescription('コインを受け取るために行動します。')
		.addStringOption(option => option.setName('種類').setDescription('どんな行動をするか選択').addChoice('仕事', 'work').addChoice('盗む', 'steal').addChoice('手伝い', 'assist')),
	async execute(interaction) {
		if (cooldown.has(interaction.user.id)) return await interaction.reply('This command can only be executed once every 5 minutes.');
		const type = interaction.options.getString('type');
		if (type === 'work') {
			const amount_w = Math.floor(Math.random() * (60 + 1 - 30)) + 30;
			await interaction.reply(`あなたはお金を手に入れました！ -> **🪙${amount_w.toString()}** コイン`);
			const profile = await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: amount_w,
					},
				},
			);
			profile.save();
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}

		else if (type === 'assist') {
			await interaction.reply('あなたはお金を手に入れました！ -> **🪙45** コイン');
			const profile = await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: 45,
					},
				},
			);
			profile.save();
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}

		else if (type === 'steal') {
			const amount_s = Math.floor(Math.random() * (250 + 1 - 30)) - 100;
			if (Math.sign(amount_s) == 1) {
				await interaction.reply(`あなたはお金を手に入れました！ -> **🪙${amount_s.toString()}** コイン`);
			}
			else if (Math.sign(amount_s) == -1) {
				await interaction.reply(`あなたはお金を失ってしまった... -> **🪙${amount_s.toString()}** コイン`);
			}
			else {
				await interaction.reply('お金は増えなかった...');
			}
			const profile = await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: amount_s,
					},
				},
			);
			profile.save();
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}
	},
};