const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'emojiUpdate',

	async execute(oldEmoji, newEmoji) {
        if (!oldEmoji.guild.me.permissions.has(PermissionFlagsBits.VIEW_AUDIT_LOG)) return;
        const AuditLogs = await oldEmoji.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = oldEmoji.guild.members.cache.get(log.executor.id)

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('絵文字更新')
            .setDescription(
                `<@${member.id}> が 絵文字 ${newEmoji} を更新しました。`
            )
            .addFields(
                {
                    name: '__**絵文字:**__',
                    value: `**[名前]** ${newEmoji.name}\n**[ID]** ${newEmoji.id}\n**[変更]** ${log.changes[0].key}: \`${log.changes[0].old}\` => \`${log.changes[0].new}\``
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.find();
        const data = guildsData.filter(data => data.guild.id === oldEmoji.guild.id);
        try {
            if (data.length <= 0) {
                return;
            } else {
                oldEmoji.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
