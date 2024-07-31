/* eslint-disable no-undef */
const { Client, Collection, GatewayIntentBits, MessageEmbed, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { interactionEmbed, toConsole } = require('./functions.js');
const config = require('./config.json');
const rest = new REST({ version: 10 }).setToken(config.bot.token);
const fs = require('node:fs');
const wait = require('node:util').promisify(setTimeout);
const mongoose = require("mongoose");
let ready = false;

// Discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});
const slashCommands = [];
client.commands = new Collection();
client.publicCommands = new Collection();
client.restrictedCommands = new Collection();

main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(config.bot.uri);
        console.log("Database connection established!");
    } catch (err) {
        console.log("Failed to connect to database: " + err);
    }
}

// Load modals
client.modals = new Map();
const modals = fs.readdirSync('./modals').filter(file => file.endsWith('.js'));
console.info(`[MDL-LOAD] Loading modals, expecting ${modals.length} modals`);
for (const file of modals) {
  try {
    console.info(`[MDL-LOAD] Loading file ${file}`);
    const modal = require(`./modals/${file}`);
    if (modal.name) {
      console.info(`[MDL-LOAD] Loaded: ${file}`);
      client.modals.set(modal.name, modal);
    }
  } catch (e) {
    console.warn(`[MDL-LOAD] Unloaded: ${file}`);
    console.warn(`[MDL-LOAD] ${e}`);
  }
}
console.info('[MDL-LOAD] Loaded modals');

// Load commands function
const loadCommands = (dir, collection) => {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${dir}/${file}`);
        collection.set(command.data.name, command);
        slashCommands.push(command.data.toJSON());
    }
};

(async () => {
    if (!fs.existsSync('./commands')) {
        return console.info('[FILE-LOAD] No \'commands\' folder found, skipping command loading');
    }

    // Load Public commands
    loadCommands('./commands/Public', client.publicCommands);
    // Load Restricted commands
    loadCommands('./commands/Restricted', client.restrictedCommands);

    // Combine all commands into one collection for registration
    client.publicCommands.forEach(command => client.commands.set(command.data.name, command));
    client.restrictedCommands.forEach(command => client.commands.set(command.data.name, command));

    console.info('[FILE-LOAD] All files loaded into ASCII and ready to be sent');
    await wait(500); // Artificial wait to prevent instant sending
    const now = Date.now();

    try {
        console.info('[APP-CMD] Started refreshing application (/) commands.');
        const route = process.env.environment === 'development' ?
            Routes.applicationGuildCommands(config.bot.applicationId, config.bot.guildId) :
            Routes.applicationCommands(config.bot.applicationId);
        
        await rest.put(route, { body: slashCommands });
        const then = Date.now();
        console.info(`[APP-CMD] Successfully reloaded application (/) commands after ${then - now}ms.`);
    } catch (error) {
        console.error('[APP-CMD] An error has occurred while attempting to refresh application commands.');
        console.error(`[APP-CMD] ${error}`);
    }
    console.info('[FILE-LOAD] All files loaded successfully');
    ready = true;
})();

client.on('ready', async () => {
    await client.application.commands.set(slashCommands)
        .then(() => ready = true)
        .catch(e => console.error("[APP-CMD] Failed to set slash commands\n", e));

    console.info('[READY] Client is ready');
    console.info(`[READY] Logged in as ${client.user.tag} (${client.user.id}) at ${new Date()}`);
    toConsole(`[READY] Logged in as ${client.user.tag} (${client.user.id}) at <t:${Math.floor(Date.now() / 1000)}:T>. Client ${ready ? 'can' : '**cannot**'} receive commands!`, 'client.on(ready)', client);

    // Start of Bot Status
    client.user.setActivity({
        name: "to court cases! ",
        type: ActivityType.Listening
    });
    // End of bot status
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.inGuild()) {
        return interactionEmbed(4, '[WARN-NODM]', '', interaction, client, [true, 10]);
    }
    if (!ready) {
        return interactionEmbed(4, '', 'The bot is starting up, please wait', interaction, client, [true, 10]);
    }

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        // Restrict command execution to specific guilds
        const restrictedGuildId = config.bot.adminGuildId;
        if (client.restrictedCommands.has(command.data.name)) {
            if (interaction.guildId !== restrictedGuildId) {
                return interaction.reply({ content: 'This command can only be used in the admin guild.', ephemeral: true });
            }
        }

        if (command) {
            command.run(client, interaction, interaction.options).catch(e => {
                interaction.editReply('Something went wrong while executing the command. Please report this to the developer');
                toConsole(e.stack, `command.run(${command.name})`, client);
            });
        }

        await wait(1e4);
        interaction.fetchReply().then(m => {
            if (m.content === '' && m.embeds.length === 0) {
                interactionEmbed(3, '[ERR-UNK]', 'The command timed out and failed to reply in 10 seconds', interaction, client, [true, 15]);
            }
        });
    } else {
        interaction.deferReply();
    }

    if (interaction.isModalSubmit()) {
        // modals need to have the same name as the commands they are started with
        const modalName = interaction.customId;
        const modal = client.modals.get(modalName);
        if (modal) {
          modal.run(client, interaction, interaction.fields);
        } else {
          await interaction.reply("Modal not found.");
          console.warn(`No modal found for: ${modalName}`);
          toConsole(`No modal found for: ${modalName}`,new Error().stack,client);
        }
      }
      if(interaction.isMessageContextMenuCommand())
      {
        const command = client.commands.get(interaction.commandName);
        command.run(client, interaction);
    
      }
      if(interaction.isAutocomplete()){
        const command = client.commands.get(interaction.commandName);
        await command.autocomplete(interaction);
      }
    });

client.login(config.bot.token);

//#region Error handling
process.on('uncaughtException', (err, origin) => {
    if (!ready) {
        console.warn('Exiting due to a [uncaughtException] during start up');
        console.error(err, origin);
        return process.exit(14);
    }
    toConsole(`An [uncaughtException] has occurred.\n\n> ${err}\n> ${origin}`, 'process.on(\'uncaughtException\')', client);
});

process.on('unhandledRejection', async (promise) => {
    if (!ready) {
        console.warn('Exiting due to a [unhandledRejection] during start up');
        console.error(promise);
        return process.exit(15);
    }
    const suppressChannel = await client.channels.fetch(config.discord.suppressChannel).catch(() => undefined);
    if (!suppressChannel) return console.error(`An [unhandledRejection] has occurred.\n\n> ${promise}`);
    if (String(promise).includes('Interaction has already been acknowledged.') || String(promise).includes('Unknown interaction') || String(promise).includes('Unknown Message')) {
        return suppressChannel.send(`A suppressed error has occurred at process.on(unhandledRejection):\n>>> ${promise}`);
    }
    toConsole(`An [unhandledRejection] has occurred.\n\n> ${promise}`, 'process.on(\'unhandledRejection\')', client);
});

process.on('warning', async (warning) => {
    if (!ready) {
        console.warn('[warning] has occurred during start up');
        console.warn(warning);
    }
    toConsole(`A [warning] has occurred.\n\n> ${warning}`, 'process.on(\'warning\')', client);
});

//#endregion