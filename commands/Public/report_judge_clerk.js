const { Client, CommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  name: "report_judge_clerk",
  description: "To submit the report form against a judge or clerk",
  data: new SlashCommandBuilder()
    .setName("report_judge_clerk")
    .setDescription("To submit the report form against a judge or clerk"),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const report_judge_clerk = new ModalBuilder({ title: "Judge Report Form", custom_id: "report_judge" });

    const TIB1 = new TextInputBuilder({ label: "Offender", custom_id: "offender_roblox", min_length: 3, max_length: 32, style: TextInputStyle.Short });
    const TIB2 = new TextInputBuilder({ label: "Judge or clerk", placeholder: "Are they judge or clerk?", custom_id: "judge_or_clerk", min_length: 3, max_length: 32, style: TextInputStyle.Short });
    const TIB3 = new TextInputBuilder({ label: "Description of the incident", placeholder: "Any possible description of what happened?", custom_id: "the_violations", min_length: 3, max_length: 1024, style: TextInputStyle.Paragraph });
    const TIB4 = new TextInputBuilder({ label: "Evidence", placeholder: "Please provide your evidence may be a link also.", custom_id: "evidence", min_length: 2, max_length: 1024, style: TextInputStyle.Paragraph });
    const TIB5 = new TextInputBuilder({ label: "Any Eye Witness?", placeholder: "Any eye witness you have?", custom_id: "eye_witness", min_length: 3, max_length: 32, style: TextInputStyle.Short });

    const row1 = new ActionRowBuilder().addComponents(TIB1);
    const row2 = new ActionRowBuilder().addComponents(TIB2);
    const row3 = new ActionRowBuilder().addComponents(TIB3);
    const row4 = new ActionRowBuilder().addComponents(TIB4);
    const row5 = new ActionRowBuilder().addComponents(TIB5);

    report_judge_clerk.addComponents(row1, row2, row3, row4, row5);

    try {
      await interaction.showModal(report_judge_clerk);
    } catch (error) {
      console.error("Failed to show modal:", error);
      await interaction.editReply({ content: "There was an error showing the modal. Please try again later.", ephemeral: true });
    }
  }
};
