const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');
const Case = require('../../DBModels/case_list');

module.exports = {
    name: 'add_appeal',
    description: 'To add the case in the database',
    data: new SlashCommandBuilder()
        .setName('add_appeal')
        .setDescription('Add a new case to the database')
        .addStringOption(option => option.setName('discord_username').setDescription('Discord username').setRequired(true))
        .addStringOption(option => option.setName('roblox_username').setDescription('Roblox username').setRequired(true))
        .addStringOption(option => option.setName('offense').setDescription('Offense committed').setRequired(true))
        .addStringOption(option => option.setName('punishment').setDescription('Punishment appealing').setRequired(true))
        .addStringOption(option => option.setName('background').setDescription('Background information').setRequired(true))
        .addStringOption(option => option.setName('in_person_or_discord').setDescription('In-person or Discord').addChoices(
            { name: 'In Person', value: 'In Person' },
            { name: 'In Discord', value: 'In Discord' }
        ).setRequired(true))
        .addStringOption(option => option.setName('deserved_or_not').setDescription('Deserved or undeserved').addChoices(
            { name: 'DESERVED', value: 'DESERVED' },
            { name: 'UNDESERVED', value: 'UNDESERVED' }
        ).setRequired(true))
        .addStringOption(option => option.setName('branch').setDescription('Branch where the offense occurred').addChoices(
            { name: 'Military', value: 'Military' },
            { name: 'Government', value: 'Government' },
            { name: 'Both', value: 'Both' },
            { name: 'Other', value: 'Other' }
        ).setRequired(true))
        .addStringOption(option => option.setName('status').setDescription('Status of the case').addChoices(
            { name: 'PENDING', value: 'PENDING' },
            { name: 'DENIED', value: 'DENIED' },
            { name: 'PENDING APPROVAL FROM COA COMMAND', value: 'PENDING APPROVAL FROM COA COMMAND' },
            { name: 'ON HOLD', value: 'ON HOLD' },
            { name: 'AWAITING ASSIGNMENT', value: 'AWAITING ASSIGNMENT' },
            {name: 'ASSIGNED', value: 'ASSIGNED'},
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
       
        // Check if the user has appropriate permissions (CoA Leadership)
        const requiredRoles = ['1019717342227333192', '1083095989323313242', '1083096092356391043', '1270040254891692152'];

        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
        if (!hasRole) {
          return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
        }
        
        const discordUsername = options.getString('discord_username');
        const robloxUsername = options.getString('roblox_username');
        const offense = options.getString('offense');
        const caseLink = options.getString('case_link') || 'N/A';
        const punishment = options.getString('punishment');
        const background = options.getString('background');
        const inPersonOrDiscord = options.getString('in_person_or_discord');
        const deservedOrNot = options.getString('deserved_or_not');
        const status = options.getString('status');
        const judgesAssigned = options.getBoolean('judges_assigned');
        const judgesUsername = options.getString('judges_username') || 'N/A';
        const branch = options.getString('branch');

        // Generate case ID with branch prefix
        const caseCount = await Case.countDocuments() + 1;
        let caseIdPrefix;
        switch (branch) {
            case 'Military':
                caseIdPrefix = 'MIL';
                break;
            case 'Government':
                caseIdPrefix = 'GOV';
                break;
            case 'Both':
            case 'Other':
            default:
                caseIdPrefix = 'GEN';
                break;
        }
        const caseId = `${caseIdPrefix}/${caseCount.toString().padStart(3, '0')}`;

        const newCase = new Case({
            case_id: caseId,
            discord_username: discordUsername,
            roblox_username: robloxUsername,
            offense: offense,
            case_link: caseLink,
            punishment: punishment,
            background: background,
            in_person_or_discord: inPersonOrDiscord,
            deserved_or_not: deservedOrNot,
            status: status,
            judges_assigned: judgesAssigned,
            judges_username: judgesUsername,
            branch: branch
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
