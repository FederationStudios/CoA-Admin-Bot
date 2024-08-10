const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');
const Case = require('../../DBModels/case_list');
const { interactionEmbed } = require("../../functions");

module.exports = {
    name: "decline_appeal",
    description: "To decline someone's case.",
    data: new SlashCommandBuilder()
        .setName('decline_appeal')
        .setDescription('Decline a specific case and optionally provide a reason.')
        .addStringOption(option =>
            option.setName('caseid')
                .setDescription('The case ID to decline')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to notify')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for declining the case')
                .setRequired(false)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        
        // Check if the user has appropriate permissions (CoA Leadership)
        const requiredRoles = ['1019717342227333192', '1083095989323313242', '1083096092356391043', '1270040254891692152'];

        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
        if (!hasRole) {
          return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
        }
        
        const caseId = options.getString('caseid');
        const user = options.getUser('user');
        const reason = options.getString('reason') || 'No reason provided';

        try {
            const caseData = await Case.findOne({ case_id: caseId });

            if (!caseData) {
                return interaction.reply({ content: `No case found with ID ${caseId}`, ephemeral: true });
            }

            if (caseData.status === 'DENIED') {
                return interaction.reply({ content: `Case ${caseId} has already been declined.`, ephemeral: true });
            }

            caseData.status = 'DENIED';
            caseData.decline_reason = reason;
            await caseData.save();

            // Send a DM to the mentioned user
            try {
                const embed = new EmbedBuilder()
                    .setTitle('Case Declined')
                    .setDescription(`Your case with ID ${caseId} has been declined.`)
                    .addFields({ name: 'Reason', value: reason })
                    .setColor('#ff0000')
                    .setFooter({ text: 'United Baltic Imperial District - St. Petersburg, Judiciary Headquarters' });

                await user.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
                await interaction.reply({ content: 'Case was declined, but there was an error notifying the user.', ephemeral: true });
                return;
            }

            await interaction.reply({ content: `Case ${caseId} has been declined successfully.`, ephemeral: true });
        } catch (error) {
            console.error('Error declining case:', error);
            await interaction.reply({ content: 'There was an error while declining the case.', ephemeral: true });
        }
    },
};
