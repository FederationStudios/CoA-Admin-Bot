const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } = require("discord.js");
const case_list = require("../../DBModels/case_list");
const { interactionEmbed } = require("../../functions");

module.exports = {
    name: "dmcaseid",
    description: "DM's the appellate's case ID for future reference",
    data: new SlashCommandBuilder()
        .setName("dmcaseid")
        .setDescription("DM the case ID to a user.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to DM.")
            .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async run(client, interaction) {
        const requiredRoles = ['1264055683884646482', '1008740829017424053'];

        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
        if (!hasRole) {
            return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
        }

        const user = interaction.options.getUser("user");

        try {
            // Fetch the case ID from the database based on the provided user's ID
            const caseData = await case_list.findOne({ discord_username: user.tag });

            if (!caseData) {
                return interactionEmbed(2, "[WARN-DM]", `No case ID found for ${user.tag}.`, interaction, client, [true, 30]);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Your Case ID information`)
                .addFields(
                    { name: "Your discord ID", value: `${user.tag}`, inline: true },
                    { name: "Case ID allotted to you", value: `${caseData.case_id}`, inline: false }
                )
                .setFooter({
                    text: `CoA - Secure Transmission | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp(new Date())
                .setColor('Aqua');

            await user.send({ content: "⚠️ Details below is your case ID. Do not share! ⚠️", embeds: [embed] });

            return interactionEmbed(1, "Successful!", "DM sent successfully!", interaction, client, [true, 30]);
        } catch (error) {
            console.error('Error sending DM:', error);
            return interactionEmbed(2, "[WARN-DM]", "An error occurred while sending the DM.", interaction, client, [true, 30]);
        }
    }
};
