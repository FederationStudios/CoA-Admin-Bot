const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list');

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
        .addStringOption(option => option.setName('appealed_to_other_body').setDescription('Appealed to another body? (yes or no)').addChoices(
            {name: 'YES', value: 'YES'},
            {name: 'NO', value: 'NO'}
        ).setRequired(true))
        .addStringOption(option => option.setName('in_person_or_discord').setDescription('In-person or Discord').addChoices(
            {name: 'In Person', value: 'In Person' },
            {name: 'In Discord', value: 'In Discord'}
        ).setRequired(true))
        .addStringOption(option => option.setName('deserved_or_not').setDescription('Deserved or undeserved').addChoices(
            {name: 'DESERVED', value: 'DESERVED'},
            {name: 'UNDESERVED', value: 'UNDESERVED'}
        ).setRequired(true))
        .addStringOption(option => option.setName('case_link').setDescription('Disciplinary case link (optional)').setRequired(false))
        .addStringOption(option => option.setName('additional_info').setDescription('Additional information').setRequired(false)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {CommandInteractionOptionResolver} options
    */
    async run(client, interaction, options) {
        await interaction.deferReply();
        const appellate = interaction.options.getString('appellate');
        const discordUsername = interaction.user.tag;  // Fetching the Discord username automatically
        const offense = interaction.options.getString('offense');
        const caseLink = interaction.options.getString('case_link') || 'N/A';
        const punishment = interaction.options.getString('punishment');
        const background = interaction.options.getString('background');
        const appealedToOtherBody = interaction.options.getString('appealed_to_other_body');
        const inPersonOrDiscord = interaction.options.getString('in_person_or_discord');
        const deservedOrNot = interaction.options.getString('deserved_or_not');
        const additionalInfo = interaction.options.getString('additional_info') || 'N/A';

        const embed = new EmbedBuilder()
            .setTitle('New Appeal Submitted')
            .addFields(
                { name: 'Appellate', value: appellate, inline: true },
                { name: 'Discord Username', value: discordUsername, inline: false },
                { name: 'Offense', value: offense, inline: false },
                { name: 'Case Link', value: caseLink, inline: false },
                { name: 'Punishment', value: punishment, inline: false },
                { name: 'Background Information', value: background },
                { name: 'Appealed to Another Body', value: appealedToOtherBody, inline: false },
                { name: 'In-Person or Discord', value: inPersonOrDiscord, inline: false },
                { name: 'Deserved or Undeserved', value: deservedOrNot, inline: false },
                { name: 'Additional Information', value: additionalInfo, inline: false }
            )
            .setFooter({
                text: `CoA - Secure Transmission | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor("Aqua");

        // Send the embed to a specific channel
        const targetChannel = client.channels.cache.get("1265982268162183178");
        if (targetChannel) {
            try {
                await targetChannel.send({ content: `Incoming case incident report from ${interaction.user.tag} (${interaction.user.id})`, embeds: [embed] });
            } catch (error) {
                console.error('Failed to send message to the target channel:', error);
                await interaction.editReply({ content: "Failed to send case report. Please try again later.", ephemeral: true });
                return;
            }
        } else {
            console.error('Target channel not found.');
            await interaction.editReply({ content: "Target channel not found. Please contact an administrator.", ephemeral: true });
            return;
        }

        await interaction.user.send({ content: "Your case has been filed. Thank you for your submission.", embeds: [embed] });
        await interaction.editReply({ content: "Submission filed! 📤", embeds: [embed], ephemeral: false });
    }
};
