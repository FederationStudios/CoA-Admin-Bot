// eslint-disable-next-line no-unused-vars
const { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const fs = require("fs");
const { join } = require("path");

module.exports = {
  name: "help",
  description: "List of all commands with the description of what they do.",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of all commands with the description of what they do."),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const publicFiles = fs.readdirSync(join(__dirname, "..", "Public")).filter(file => file.endsWith(".js"));

    let embed = new EmbedBuilder()
      .setTitle("Commands");

    // Adding public commands
    const publicFields = publicFiles.map(file => {
      const command = require(join(__dirname, "..", "Public", file));
      return command.name && command.description ? {
        name: command.name,
        value: command.description,
      } : null;
    }).filter(field => field !== null);

   

    // Log the fields to check their structure
    console.log(publicFields);

    // Add all fields to the embed
    embed.addFields(publicFields);

    if (interaction.inGuild()) {
      embed.setThumbnail(client.user.avatarURL());
    }

    embed.setColor(Colors.Red);
    embed.setTimestamp();
    embed.setFooter({
      text: `Command Requested by: ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

    interaction.editReply({ embeds: [embed] });
  },
};
