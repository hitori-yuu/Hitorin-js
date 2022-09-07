const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({
            'en-US': 'help',
            'ja': 'ヘルプ',
        })
        .setDescription('Displays information about all commands or that command.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about all commands or that command.',
            'ja': '全コマンドまたは特定のコマンドの詳細を表示します。',
        })
		.setDMPermission(true)
        .addStringOption(
            option => option
            .setName('command')
            .setNameLocalizations({
                'en-US': 'command',
                'ja': 'コマンド名',
            })
            .setDescription('Enter the name of command.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the name of command.',
                'ja': 'コマンドの名前を入力。',
            })
        ),

	async execute(interaction) {
		let name = interaction.options.getString('command');
		const helpEmbed = new EmbedBuilder().setColor('#59b9c6');

		if (name) {
			name = name.toLowerCase();

			helpEmbed.setTitle(`コマンド \`${name}\``);
			helpEmbed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({format: 'png'}), url: interaction.user.displayAvatarURL({format: 'png'}) });

			if (interaction.client.slashCommands.has(name)) {
				const command = interaction.client.slashCommands.get(name);

                var DM = '使用可能';
                if (command.data.dmPermission == false) DM = '使用不可能';

                var permissions = '誰でも使用可能';
                if (command.data.default_member_permissions) permissions = '必須権限あり';

				if (command.data.description)
					helpEmbed.setDescription(
						`**[English]** ${command.data.description}\n**[日本語]** ${command.data.description_localizations.ja}\n\n**[DM]** ${DM}\n**[必要権限]** ${permissions}`
					);
			} else {
				helpEmbed
					.setDescription(`コマンド \`${name}\` は存在しません。`)
					.setColor('#59b9c6');
			}
		} else {
			helpEmbed
				.setTitle('全コマンド')
				.setDescription(
					'`' +
						interaction.client.slashCommands
							.map((command) => command.data.name)
							.join('`, `') +
						'`'
				);
		}

		interaction.followUp({
			embeds: [helpEmbed],
		});
	},
};