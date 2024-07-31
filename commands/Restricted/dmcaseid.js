// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, WebhookClient, Client, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const { interactionEmbed } = require("../../functions");

module.exports = {
    name: "dmcaseid",
    description: "DM's the ppeallate's case ID for future reference",
    data: new SlashCommandBuilder()
        .setName("dmcaseid")
        .setDescription("DM something to an user.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to DM.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("caseid")
            .setDescription("DM's the appeallate's case ID for future reference")
            .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
    
    const requiredRoles = ['1264055683884646482', '1008740829017424053'];

    const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
    if (!hasRole) {
      return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
    }

        const user = options.getUser("user");
        const text = options.getString("caseid");

        const embed = new EmbedBuilder()
        .setTitle(`Your Case ID information`)
        .addFields(
            [
                {name: "Your discord ID", value: `${interaction.user.tag}`, inline: true},
                {name: "Case ID alloted to you", value: `${text}`, inline: false}
            ]
        )
        .setFooter({text: `CoA - Secure Transmission | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
            iconURL: client.user.displayAvatarURL() })
        .setTimestamp(new Date())
        .setColor('Aqua');

        try {
            await user.send({content: "⚠️ Details below is your case ID. Do not share! ⚠️", embeds: [embed]});
        } catch (error) {
            return interactionEmbed(2, "[WARN-DM]", "", interaction, client, [true, 30]);
        }
        return interactionEmbed(1, "Successfull!", "DM sent successfully!", interaction, client, [true, 30] );
    }
};  