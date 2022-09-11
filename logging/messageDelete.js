const { EmbedBuilder, InteractionCollector } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'messageDelete',

	async execute(message) {
        if (!message.guild.me.permissions.has(PermissionFlagsBits.VIEW_AUDIT_LOG)) return;
        const AuditLogs = await message.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first();
        const member = message.guild.members.cache.get(log.executor.id);
        const target = message.guild.members.cache.get(log.target.id);

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('メッセージ削除')
            .setDescription(
                `<@${member.id}> が <@${target.id}> のメッセージを削除しました。`
            )
            .addFields(
                {
                    name: '__**チャンネル:**__',
                    value: `**[名前]** ${log.extra.channel.name || 'None'}\n**[ID]** ${log.extra.channel.id || 'None'}`
                },
                {
                    name: '__**メッセージ送信者:**__',
                    value: `**[名前]** ${target.user.tag}\n**[ID]** ${target.id}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.find();
        const data = guildsData.filter(data => data.guild.id === message.guild.id);
        try {
            if (data.length <= 0 || !data) {
                return;
            } else {
                var logCh = message.guild.channels.cache.find(ch => ch.id === data[0].channel.id).send({embeds: [logEmbed]});
                if (!logCh) return;
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
