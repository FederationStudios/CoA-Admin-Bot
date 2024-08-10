const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    name: "subpoena_duces_tecum",
    description: "DM's the user with details about the individual to collect evidence from.",
    data: new SlashCommandBuilder()
        .setName("subpoena_duces_tecum")
        .setDescription("DMs the user with details for evidence collection.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to DM.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("username")
            .setDescription("Username of the individual.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("branch")
            .setDescription("Branch related to the request.")
            .setRequired(true)
            .addChoices(
                { name: 'Military', value: 'Military' },
                { name: 'Government', value: 'Government' },
                { name: 'Both', value: 'Both' }
            ))
        .addStringOption(option => option
            .setName("case_details")
            .setDescription("The case details if you want to add.")
            .setRequired(false)),
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
      
        const requiredRoles = ['1264055683884646482', '1008740829017424053', '1270040254891692152'];
        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasRole) {
            console.log("User does not have the required role.");
            return interaction.reply({ content: "You do not have permission to run this command.", ephemeral: true });
        }

        const user = options.getUser("user");
        const username = options.getString("username");
        const branch = options.getString("branch");
        const details = options.getString("case_details");

        const embed = new EmbedBuilder()
            .setTitle(`Subpoena Request`)
            .addFields(
                { name: "Individual", value: username, inline: true },
                { name: "Branch", value: branch, inline: true },
                { name: "Case details", value: details || "No details provided", inline: false }
            )
            .setFooter({ text: `Request sent at ${new Date().toLocaleTimeString()}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(new Date())
            .setColor("Red");

        try {
            await user.send({ content: "⚠️ Subpoena request. Please see the details below. ⚠️", embeds: [embed] });
            await user.send("Make a proper evidence document and make sure it is a classified document and use /submit_evidence in CoA discord server to send it.");
            await interaction.reply({ content: "DM sent successfully!", ephemeral: true });
        } catch (error) {
            console.error("Error sending DM:", error);
            await interaction.reply({ content: "An error occurred while sending the DM.", ephemeral: true });
        }
    }
};
