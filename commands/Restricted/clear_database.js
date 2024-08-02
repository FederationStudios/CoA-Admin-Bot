const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const BackupMessage = require('../../DBModels/case_list'); // Adjust the path as necessary


module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear_database')
    .setDescription('Clear all backup messages from the database'),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const yourUserId = '342982972473081856'; // Replace with your actual user ID

    // Check if the user is you
    if (interaction.user.id !== yourUserId) {
      return interaction.reply({ content: 'Lol, bro you cant just delete the case database it is the most important database not even HC can use this command only one person can and he/she/they are ........ (its a secret 🤫 ) Love you all', ephemeral: false });
    }

    try {
      // Remove all documents from the collection
      await BackupMessage.deleteMany({});
      interaction.reply({ content: 'Database cleared successfully!', ephemeral: true });
    } catch (error) {
      console.error('Error clearing database:', error);
      interaction.reply({ content: 'An error occurred while clearing the database.', ephemeral: true });
    }
  },
};
