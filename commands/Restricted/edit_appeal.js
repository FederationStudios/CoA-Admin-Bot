const { SlashCommandBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list'); // Adjust the path to your case model

module.exports = {
    name: "edit_appeal",
    description: "Edit details of a case.",
    data: new SlashCommandBuilder()
        .setName("edit_appeal")
        .setDescription("Edit details of a case.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("roblox_username")
                .setDescription("Edit the Roblox username for a case.")
                .addStringOption(option => option
                    .setName("case_id")
                    .setDescription("The ID of the case to edit.")
                    .setRequired(true))
                .addStringOption(option => option
                    .setName("new_roblox_username")
                    .setDescription("The new Roblox username.")
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("discord_username")
                .setDescription("Edit the Discord username for a case.")
                .addStringOption(option => option
                    .setName("case_id")
                    .setDescription("The ID of the case to edit.")
                    .setRequired(true))
                .addStringOption(option => option
                    .setName("new_discord_username")
                    .setDescription("The new Discord username.")
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("case_link")
                .setDescription("Edit the case link for a case.")
                .addStringOption(option => option
                    .setName("case_id")
                    .setDescription("The ID of the case to edit.")
                    .setRequired(true))
                .addStringOption(option => option
                    .setName("new_case_link")
                    .setDescription("The new case link.")
                    .setRequired(true))),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        const subcommand = options.getSubcommand();
        const caseId = options.getString("case_id");

        let updateData = {};

        if (subcommand === "roblox_username") {
            const newRobloxUsername = options.getString("new_roblox_username");
            updateData = { roblox_username: newRobloxUsername };
        } else if (subcommand === "discord_username") {
            const newDiscordUsername = options.getString("new_discord_username");
            updateData = { discord_username: newDiscordUsername };
        } else if (subcommand === "case_link") {
            const newCaseLink = options.getString("new_case_link");
            updateData = { case_link: newCaseLink };
        }

        try {
            const caseDocument = await case_list.findOneAndUpdate(
                { case_id: caseId },
                updateData,
                { new: true }
            );

            if (caseDocument) {
                interaction.reply({ content: `${subcommand.replace('_', ' ')} updated successfully for case ID ${caseId}.`, ephemeral: true });
            } else {
                interaction.reply({ content: `Case with ID ${caseId} not found.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `An error occurred while updating the ${subcommand.replace('_', ' ')}.`, ephemeral: true });
        }
    }
};
