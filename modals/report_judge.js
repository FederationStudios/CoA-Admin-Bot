const { Client, ModalSubmitInteraction, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "report_judge",
  /**
   * @param {Client} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const fields = interaction.fields;

      // Defer the reply immediately to avoid interaction timeout
      await interaction.deferReply({ ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle("Judge Report Form")
        .setColor(Colors.Red)
        .addFields(
          { name: "Submitter", value: `<@${interaction.user.id}>`, inline: false },
          { name: "Offender", value: fields.getTextInputValue("offender_roblox"), inline: false },
          { name: "Judge or Clerk", value: fields.getTextInputValue("judge_or_clerk"), inline: false },
          { name: "Description of the Incident", value: fields.getTextInputValue("the_violations"), inline: false },
          { name: "Evidence", value: fields.getTextInputValue("evidence"), inline: false },
          { name: "Any Eye Witness?", value: fields.getTextInputValue("eye_witness"), inline: false }
        )
        .setFooter({
          text: `CoA - Secure Transmission | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
          iconURL: client.user.displayAvatarURL()
        });

      const targetChannel = client.channels.cache.get("1269982024811286528");
      if (targetChannel) {
        await targetChannel.send({
          content: `Incoming case incident report from ${interaction.user.tag} (${interaction.user.id})`,
          embeds: [embed]
        });
      } else {
        console.error('Target channel not found.');
        await interaction.editReply({
          content: "Target channel not found. Please contact an administrator.",
          ephemeral: true
        });
        return;
      }

      await interaction.user.send({
        content: "Your case has been filed. Thank you for your submission.",
        embeds: [embed]
      });

      await interaction.editReply({
        content: "Submission filed! 📤",
        embeds: [embed],
        ephemeral: true
      });

    } catch (error) {
      console.error('Error handling modal submission:', error);
      // Ensure that not calling editReply if the interaction is no longer valid
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "There was an error processing your submission. Please try again later.",
          ephemeral: true
        });
      }
    }
  }
};
