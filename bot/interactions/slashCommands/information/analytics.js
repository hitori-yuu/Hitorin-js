const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    category: 'information',

    data: new SlashCommandBuilder()
    .setName('analytics')
    .setDescription('Displays the analytics of this server.')
    .setDescriptionLocalizations({
        'en-US': 'Displays the analytics of this server.',
        'ja': 'このーサーバーのアナリティクスを表示します。',
    }),

	async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('analytics')
                    .setPlaceholder('表示する種類を選択')
                    .addOptions(
                        {
                            label: 'メンバーの内訳',
                            description: 'メンバーのユーザーとボットの内訳を表示します。',
                            value: 'analyticsBreakdown',
                        },
                        {
                            label: 'メンバー数の推移',
                            description: 'メンバーの数の推移を表示します。',
                            value: 'analyticsTransition',
                        },
                    ),
            );


        const analyticsEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle('サーバーのアナリティクス')
            .addFields(
                {
                    name: 'メンバーの内訳',
                    value: 'メンバーのユーザーとボットの内訳を表示します。'
                },
                {
                    name: 'メンバー数の推移',
                    value: 'メンバーの数の推移を表示します。'
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await interaction.reply({
            embeds: [analyticsEmbed],
            components: [row]
        });
	},
};