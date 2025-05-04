client.functionManager.createFunction({
    name: "$getRandomMessage",
    type: "djs",
    code: async d => {
      const data = d.util.aoiFunc(d);
      const [serverId, channelId] = data.inside.splits;
  
      try {
        const server = await d.client.guilds.fetch(serverId);
        if (!server) throw new Error('Sunucu bulunamadı. Lütfen geliştiriciye bu durumu bildirin.');
  
        const channel = await server.channels.fetch(channelId);
        if (!channel) throw new Error('Kanal bulunamadı. Lütfen geliştiriciye bu durumu bildirin.');
  
        const messages = await channel.messages.fetch({ limit: 100 });
        if (messages.size === 0) throw new Error('Bu kategoride içerik bulunamadı. Daha sonra tekrar deneyin.');
  
        const randomMessage = messages.random();
        const videoUrl = randomMessage.content;
        if (!videoUrl || !videoUrl.startsWith("http")) throw new Error('Geçerli bir video URL\'si bulunamadı.');
  
        data.result = videoUrl;
  
        return {
          code: d.util.setCode(data)
        };
  
      } catch (error) {
        data.result = `Error: ${error.message}`;
        return {
          code: d.util.setCode(data)
        };
      }
    }
  });
  