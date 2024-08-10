const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    name: "appeal",
    description: "To submit an appeal to CoA",
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Submit an appeal')
        .addStringOption(option => option.setName('appellate').setDescription('Appellate\'s username (Your username)').setRequired(true))
        .addStringOption(option => option.setName('offence').setDescription('Offence committed').setRequired(true))
        .addStringOption(option => option.setName('punishment').setDescription('Punishment appealing').setRequired(true))
        .addStringOption(option => option.setName('background').setDescription('Background information').setRequired(true))
        .addStringOption(option => option.setName('appealed_to_other_body').setDescription('Appealed to another body?').addChoices(
            { name: 'YES', value: 'YES' },
            { name: 'NO', value: 'NO' }
        ).setRequired(true))
        .addStringOption(option => option.setName('in_person_or_discord').setDescription('In-person or Discord').addChoices(
            { name: 'In Person', value: 'In Person' },
            { name: 'In Discord', value: 'In Discord' }
        ).setRequired(true))
        .addStringOption(option => option.setName('deserved_or_not').setDescription('Deserved or undeserved').addChoices(
            { name: 'DESERVED', value: 'DESERVED' },
            { name: 'UNDESERVED', value: 'UNDESERVED' }
        ).setRequired(true))
        .addStringOption(option => option.setName('branch').setDescription('Branch of the incident').addChoices(
            { name: 'Military', value: 'Military' },
            { name: 'Government', value: 'Government' },
            { name: 'Both', value: 'Both' },
            { name: 'Other', value: 'Other' }
        ).setRequired(true))
        .addStringOption(option => option.setName('case_link').setDescription('Disciplinary case link (optional)').setRequired(false))
        .addStringOption(option => option.setName('additional_info').setDescription('Additional information').setRequired(false)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {CommandInteractionOptionResolver} options
    */
    async run(client, interaction, options) {
        await interaction.deferReply({ ephemeral: true }); // Make the interaction reply ephemeral

        const truncateText = (text, maxLength = 1000) => {
            if (!text) return 'N/A'; // Handle null or undefined values
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        };

        const appellate = interaction.options.getString('appellate');
        const discordUsername = interaction.user.tag;  // Fetching the Discord username automatically
        const offence = interaction.options.getString('offence');
        const caseLink = interaction.options.getString('case_link') || 'N/A';
        const punishment = interaction.options.getString('punishment');
        const background = truncateText(interaction.options.getString('background'));
        const appealedToOtherBody = interaction.options.getString('appealed_to_other_body');
        const inPersonOrDiscord = interaction.options.getString('in_person_or_discord');
        const deservedOrNot = interaction.options.getString('deserved_or_not');
        const branch = interaction.options.getString('branch');
        const additionalInfo = truncateText(interaction.options.getString('additional_info')) || 'N/A';


        const embed = new EmbedBuilder()
        .setTitle('New Appeal Submitted')
        .addFields(
            { name: 'Appellate', value: appellate, inline: true },
            { name: 'Discord Username', value: discordUsername, inline: false },
            { name: 'Offence', value: offence, inline: false },
            { name: 'Case Link', value: caseLink.length > 1000 ? 'Link too long' : caseLink, inline: false },
            { name: 'Punishment', value: punishment, inline: false },
            { name: 'Background Information', value: background.length > 1000 ? 'Background info too long' : background },
            { name: 'Appealed to Another Body', value: appealedToOtherBody, inline: false },
            { name: 'In-Person or Discord', value: inPersonOrDiscord, inline: false },
            { name: 'Deserved or Undeserved', value: deservedOrNot, inline: false },
            { name: 'Branch', value: branch, inline: false },
            { name: 'Additional Information', value: additionalInfo.length > 1000 ? 'Additional info too long' : additionalInfo, inline: false }
        )
        .setFooter({
            text: `United Baltic Imperial District - St. Petersburg, Judiciary Headquarters | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
            iconURL: client.user.displayAvatarURL()
        })
        .setColor("Red")
        .setImage("https://media.discordapp.net/attachments/1101207990918463600/1227756827543076955/COAPropo2.png?ex=66b009a6&is=66aeb826&hm=1fa2928f6d86f2320aff3f08a9ac3ee04610231534242aeae8c289dd6aa39db9&format=webp&quality=lossless&width=1177&height=662&");
    

        // Send the embed to a specific channel
        const targetChannel = client.channels.cache.get("1269981941214482463");
        if (targetChannel) {
            try {
                await targetChannel.send({ content: `Incoming case incident report from ${interaction.user.tag} (${interaction.user.id})`, embeds: [embed] });
            } catch (error) {
                await interaction.editReply({ content: "Failed to send case report. Please try again later.", ephemeral: true });
                return;
            }
        } else {
            await interaction.editReply({ content: "Target channel not found. Please contact an administrator.", ephemeral: true });
            return;
        }

        await interaction.user.send({ content: "Your case has been filed. Thank you for your submission.", embeds: [embed] });
        await interaction.editReply({ content: "Submission filed! 📤", embeds: [embed], ephemeral: true });
    }
};
