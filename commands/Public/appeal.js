const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    name: "appeal",
    description: "To submit an appeal to CoA",
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Submit an appeal')
        .addStringOption(option => option.setName('appellate').setDescription('Appellate\'s username').setRequired(true))
        .addStringOption(option => option.setName('offense').setDescription('Offense committed').setRequired(true))
        .addStringOption(option => option.setName('punishment').setDescription('Punishment appealing').setRequired(true))
        .addStringOption(option => option.setName('background').setDescription('Background information').setRequired(true))
        .addStringOption(option => option.setName('appealed_to_other_body').setDescription('Appealed to another body? (yes or no)').setRequired(true))
        .addStringOption(option => option.setName('in_person_or_discord').setDescription('In-person or Discord (in-game or Discord)').setRequired(true))
        .addStringOption(option => option.setName('deserved_or_undeserved').setDescription('Deserved or undeserved').setRequired(true))
        .addStringOption(option => option.setName('case_link').setDescription('Disciplinary case link (optional)').setRequired(false))
        .addStringOption(option => option.setName('additional_info').setDescription('Additional information').setRequired(false)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {CommandInteractionOptionResolver} options
    */
    async run(client, interaction, options) {
        const appellate = interaction.options.getString('appellate');
        const discordUsername = interaction.user.tag;  // Fetching the Discord username automatically
        const offense = interaction.options.getString('offense');
        const caseLink = interaction.options.getString('case_link') || 'N/A';
        const punishment = interaction.options.getString('punishment');
        const background = interaction.options.getString('background');
        const appealedToOtherBody = interaction.options.getString('appealed_to_other_body');
        const inPersonOrDiscord = interaction.options.getString('in_person_or_discord');
        const deservedOrUndeserved = interaction.options.getString('deserved_or_undeserved');
        const additionalInfo = interaction.options.getString('additional_info') || 'N/A';

        const embed = new EmbedBuilder()
            .setTitle('New Appeal Submitted')
            .addFields(
                { name: 'Appellate', value: appellate },
                { name: 'Discord Username', value: discordUsername },
                { name: 'Offense', value: offense },
                { name: 'Case Link', value: caseLink },
                { name: 'Punishment', value: punishment },
                { name: 'Background Information', value: background },
                { name: 'Appealed to Another Body', value: appealedToOtherBody },
                { name: 'In-Person or Discord', value: inPersonOrDiscord },
                { name: 'Deserved or Undeserved', value: deservedOrUndeserved },
                { name: 'Additional Information', value: additionalInfo }
            )
            .setColor("Aqua");

        // Send the embed to a specific channel
        const appealChannelId = 'YOUR_CHANNEL_ID_HERE'; // Replace with your channel ID
        const appealChannel = interaction.guild.channels.cache.get(appealChannelId);

        if (appealChannel) {
            await appealChannel.send({ embeds: [embed] });
        }

        // Send the embed to the user's DMs
        await interaction.user.send({ embeds: [embed] });

        // Confirmation message
        await interaction.reply({ content: 'Your appeal has been submitted successfully and a confirmation has been sent to your DMs.', ephemeral: true });
    }
};
