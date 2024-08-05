
// eslint-disable-next-line no-unused-vars
const { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const fs = require("fs");
const {join} = require("path");

module.exports = {
  name: "help_staff",
  description: "To help CoA staff memeber in their activities",
  data: new SlashCommandBuilder()
    .setName("help_staff")
    .setDescription("Shows a list of all the bot commands!"),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();


    const secretFiles = fs.readdirSync(join(__dirname, "..", "Restricted")).filter(file => file.endsWith(".js"));

    let embed = new EmbedBuilder()
      .setTitle("Commands");

      for (const file of secretFiles) {
        const command = require(join(__dirname, "..", "restricted", file));
        embed.addFields({
          name: command.name, value: command.description ? command.description : "No description for this command."
        });
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