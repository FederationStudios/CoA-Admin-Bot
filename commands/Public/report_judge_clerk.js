const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'report_judge_clerk',
    description: 'Submit a judge report form.',
    data: new SlashCommandBuilder()
        .setName('report_judge_clerk')
        .setDescription('Submit a judge report form')
        .addStringOption(option => 
            option.setName('offender_roblox')
                .setDescription('The Roblox username of the offender')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('judge_or_clerk')
                .setDescription('The name of the judge or clerk involved')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('the_violations')
                .setDescription('Description of the incident')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('evidence')
                .setDescription('Provide evidence for the incident')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('eye_witness')
                .setDescription('Any eye witness?')
                .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async(client, interaction, options) => {
        try {
            // Defer the reply immediately to avoid interaction timeout
            await interaction.deferReply({ ephemeral: true });

            const offenderRoblox = interaction.options.getString('offender_roblox');
            const judgeOrClerk = interaction.options.getString('judge_or_clerk');
            const theViolations = interaction.options.getString('the_violations');
            const evidence = interaction.options.getString('evidence');
            const eyeWitness = interaction.options.getString('eye_witness');

            const embed = new EmbedBuilder()
                .setTitle("Judge Report Form")
                .setColor(Colors.Red)
                .addFields(
                    { name: "Submitter", value: `<@${interaction.user.id}>`, inline: false },
                    { name: "Offender", value: offenderRoblox, inline: false },
                    { name: "Judge or Clerk", value: judgeOrClerk, inline: false },
                    { name: "Description of the Incident", value: theViolations, inline: false },
                    { name: "Evidence", value: evidence, inline: false },
                    { name: "Any Eye Witness?", value: eyeWitness, inline: false }
                )
                .setFooter({
                    text: `United Baltic Imperial District - St. Petersburg, Judiciary Headquarters  | Filed at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setImage("https://media.discordapp.net/attachments/1101207990918463600/1227756827543076955/COAPropo2.png?ex=66b009a6&is=66aeb826&hm=1fa2928f6d86f2320aff3f08a9ac3ee04610231534242aeae8c289dd6aa39db9&format=webp&quality=lossless&width=1177&height=662&");

            const targetChannel = client.channels.cache.get("1269982024811286528");
            if (targetChannel) {
                await targetChannel.send({
                    content: `Incoming case incident report from ${interaction.user.tag} (${interaction.user.id})`,
                    embeds: [embed]
                });
            } else {
                console.error('Target channel not found.');
                await interaction.editReply({
                    content: "Target channel not found. Please contact an administrator.",
                    ephemeral: true
                });
                return;
            }

            await interaction.user.send({
                content: "Your case has been filed. Thank you for your submission.",
                embeds: [embed]
            });

            await interaction.editReply({
                content: "Submission filed! 📤",
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error handling slash command:', error);
                await interaction.editReply({
                    content: "There was an error processing your submission. Please try again later.",
                    ephemeral: true
                });
            }
        }
    };
