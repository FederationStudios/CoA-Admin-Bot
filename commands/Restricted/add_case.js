const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'add_case',
    description: 'Add a new case to the database',
    data: new SlashCommandBuilder()
    .setName('add_case')
    .setDescription('Add a new case to the database')
    .addStringOption(option => option.setName('discord_username').setDescription('Discord username').setRequired(true))
    .addStringOption(option => option.setName('offense').setDescription('Offense committed').setRequired(true))
    .addStringOption(option => option.setName('punishment').setDescription('Punishment appealing').setRequired(true))
    .addStringOption(option => option.setName('background').setDescription('Background information').setRequired(true))
    .addStringOption(option => option.setName('in_person_or_discord').setDescription('In-person or Discord').addChoices(
        {name: 'In Person', value: 'In Person' },
        {name: 'In Discord', value: 'In Discord'}
    ).setRequired(true))
    .addStringOption(option => option.setName('deserved_or_not').setDescription('Deserved or undeserved').addChoices(
        {name: 'DESERVED', value: 'DESERVED'},
        {name: 'UNDESERVED', value: 'UNDESERVED'}
    ).setRequired(true))
    .addStringOption(option => option.setName('status').setDescription('Status of the case')
        .addChoices(
            { name: 'PENDING', value: 'PENDING' },
            { name: 'DENIED', value: 'DENIED' },
            { name: 'PENDING APPROVAL FROM COA COMMAND', value: 'PENDING APPROVAL FROM COA COMMAND' },
            { name: 'ON HOLD', value: 'ON HOLD' },
            { name: 'AWAITING ASSIGNMENT', value: 'AWAITING ASSIGNMENT' },
            { name: 'COMPLETED', value: 'COMPLETED' }
        ).setRequired(true))
    .addBooleanOption(option => option.setName('judges_assigned').setDescription('Judges assigned').setRequired(true))
    .addStringOption(option => option.setName('judges_username').setDescription('Judges username (if assigned)').setRequired(false))
    .addStringOption(option => option.setName('case_link').setDescription('Disciplinary case link (optional)').setRequired(false)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        const discordUsername = interaction.options.getString('discord_username');
        const offense = interaction.options.getString('offense');
        const caseLink = interaction.options.getString('case_link') || 'N/A';
        const punishment = interaction.options.getString('punishment');
        const background = interaction.options.getString('background');
        const inPersonOrDiscord = interaction.options.getString('in_person_or_discord');
        const deservedOrNot = interaction.options.getString('deserved_or_not');
        const status = interaction.options.getString('status');
        const judgesAssigned = interaction.options.getBoolean('judges_assigned');
        const judgesUsername = interaction.options.getString('judges_username') || 'N/A';

        // Generate case ID
        const caseCount = await case_list.countDocuments() + 1;
        const caseId = `GEN/${caseCount.toString().padStart(3, '0')}`;

        const newCase = new case_list({
            case_id: caseId,
            discord_username: discordUsername,
            offense: offense,
            case_link: caseLink,
            punishment: punishment,
            background: background,
            in_person_or_discord: inPersonOrDiscord,
            deserved_or_not: deservedOrNot,
            status: status,
            judges_assigned: judgesAssigned,
            judges_username: judgesUsername
        });

        try {
            await newCase.save();
            await interaction.reply({ content: 'The case has been added successfully.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while adding the case.', ephemeral: true });
        }
    }
};
