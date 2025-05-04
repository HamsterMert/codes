client.functionManager.createFunction({
    name: "$messageCount",
    type: "djs",
    code: async d => {
      const data = d.util.aoiFunc(d);
      const [guildID, channelID] = data.inside.splits;
  
      const guild = client.guilds.cache.get(guildID);
      if (!guild) {
        data.result = "Geçersiz sunucu ID'si!";
        return {
          code: d.util.setCode(data)
        };
      }
  
      const channel = guild.channels.cache.get(channelID);
      if (!channel || channel.type !== 0) {
        data.result = "Geçersiz kanal ID'si veya bu kanal metin kanalı değil!";
        return {
          code: d.util.setCode(data)
        };
      }
  
      try {
        const messages = await channel.messages.fetch({ limit: 100 });
        data.result = messages.size;
      } catch (error) {
        console.error(error);
        data.result = "Mesajları alırken bir hata oluştu.";
      }
  
      return {
        code: d.util.setCode(data)
      };
    }
  });
  