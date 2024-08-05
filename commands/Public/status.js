const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'status',
    description: 'To check your appeal status.',
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('To check your appeal status.'),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async run(client, interaction) {
        const discordUsername = interaction.user.tag; // Get the user's Discord username (e.g., User#1234)

        try {
            // Find cases associated with the user's Discord username
            const cases = await case_list.find({ discord_username: discordUsername });

            if (cases.length === 0) {
                return interaction.reply({ content: 'No cases found for your Discord username.', ephemeral: true });
            }

            // Create an array to hold the embed messages
            const embeds = cases.map(c => new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Case ID: ${c.case_id}`)
                .addFields(
                    { name: 'Offense', value: c.offense, inline: true },
                    { name: 'Punishment', value: c.punishment, inline: false },
                    { name: 'Background', value: c.background },
                    { name: 'In Person or Discord', value: c.in_person_or_discord, inline: false },
                    { name: 'Deserved or Not', value: c.deserved_or_not, inline: false },
                    { name: 'Status', value: c.status, inline: true },
                    { name: 'Judges Assigned', value: c.judges_assigned ? 'Yes' : 'No', inline: false },
                    { name: 'Judges Username', value: c.judges_username || 'N/A', inline: false }
                )
                .setFooter({
                    text: `CoA - Secure Transmission | Requested at ${new Date().toLocaleTimeString()} ${new Date().toString().match(/GMT([+-]\d{2})(\d{2})/)[0]}`,
                    iconURL: client.user.displayAvatarURL()
                })
            );

            // Send the case details in a DM to the user
            for (const embed of embeds) {
                await interaction.user.send({ embeds: [embed] });
            }

            await interaction.reply({ content: 'I have sent your case details to your DMs.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while fetching your case details.', ephemeral: true });
        }
    }
};
