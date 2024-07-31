const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const { interactionEmbed } = require("../../functions")
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'delete_case',
    description: 'Delete a case from the database',
    data: new SlashCommandBuilder()
        .setName('delete_case')
        .setDescription('Delete a case from the database')
        .addStringOption(option => 
            option.setName('case_id')
                .setDescription('The ID of the case to delete')
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

        const caseId = interaction.options.getString('case_id');

        try {
            const result = await case_list.deleteOne({ case_id: caseId });

            if (result.deletedCount === 0) {
                return interaction.reply({ content: `No case found with ID ${caseId}.`, ephemeral: true });
            }

            await interaction.reply({ content: `The case with ID ${caseId} has been deleted successfully.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while deleting the case.', ephemeral: true });
        }
    }
};
