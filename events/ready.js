module.exports = {
	name: 'ready',

	async execute(client) {
		console.log(`ログイン完了: ${client.user.tag}`);
		client.user.setStatus('dnd');
		setInterval(() => {
			client.user.setActivity({
			  	name: `2.0.0v-β | ${client.guilds.cache.size} Servers`,
			})
		}, 30000)
	},
};
