import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  type Embed,
  EmbedBuilder,
  type Message,
  type MessageComponentInteraction,
  type MessageReaction,
  type User,
} from 'discord.js';

export async function paginateMessage(message: Message, embeds: Embed[]) {
  let page = 0;
  const currentPage = await message.channel.send({ embeds: [embeds[page]] });
  await currentPage.react('⬅️');
  await currentPage.react('➡️');

  const filter = (reaction: MessageReaction, user: User) =>
    ['⬅️', '➡️'].includes(reaction.emoji.name || '') && !user.bot;
  const collector = currentPage.createReactionCollector({
    filter,
    time: 60000,
  });

  collector.on('collect', (reaction, user) => {
    reaction.users.remove(user).catch(() => {});
    if (reaction.emoji.name === '➡️') {
      if (page < embeds.length - 1) page++;
    } else if (reaction.emoji.name === '⬅️') {
      if (page > 0) page--;
    }

    currentPage.edit({ embeds: [embeds[page]] }).catch(() => {});
  });

  collector.on('end', () => currentPage.reactions.removeAll().catch(() => {}));
}

function chunkArray<T = unknown>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export interface PaginatedInteractionOptions {
  first?: PaginationButton;
  previous?: PaginationButton;
  next?: PaginationButton;
  last?: PaginationButton;
}

export interface PaginationButton {
  id?: string;
  label?: string;
  color?: ButtonStyle;
}

export async function paginateInteraction(
  interaction: ChatInputCommandInteraction<'cached'>,
  embeds: (EmbedBuilder | Embed)[],
  options?: PaginatedInteractionOptions
) {
  let page = 0;

  const updateButtons = (page: number, totalPages: number) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(options?.first?.id ?? 'first')
        .setLabel(options?.first?.label ?? '⏮️First')
        .setStyle(options?.first?.color ?? ButtonStyle.Primary)
        .setDisabled(page === 0),
      new ButtonBuilder()
        .setCustomId(options?.previous?.id ?? 'previous')
        .setLabel(options?.previous?.label ?? '⬅️Previous')
        .setStyle(options?.previous?.color ?? ButtonStyle.Primary)
        .setDisabled(page === 0),
      new ButtonBuilder()
        .setCustomId(options?.next?.id ?? 'next')
        .setLabel(options?.next?.label ?? 'Next➡️')
        .setStyle(options?.next?.color ?? ButtonStyle.Primary)
        .setDisabled(page === totalPages - 1),
      new ButtonBuilder()
        .setCustomId(options?.last?.id ?? 'last')
        .setLabel(options?.last?.label ?? 'Last⏭️')
        .setStyle(options?.last?.color ?? ButtonStyle.Primary)
        .setDisabled(page === totalPages - 1)
    );
  };

  const totalPages = embeds.length;
  let row = updateButtons(page, totalPages);

  const addFooterToEmbed = (
    embed: EmbedBuilder | Embed,
    page: number,
    totalPages: number
  ) => {
    return EmbedBuilder.from(embed).setFooter({
      text: `Page ${page + 1} of ${totalPages}`,
    });
  };

  await interaction.reply({
    embeds: [addFooterToEmbed(embeds[page], page, totalPages)],
    components: [row],
  });

  const filter = (i: MessageComponentInteraction) =>
    i.user.id === interaction.user.id;
  if (!interaction.channel) return;
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  collector.on('collect', async (i: MessageComponentInteraction) => {
    switch (i.customId) {
      case 'first':
        page = 0;
        break;
      case 'previous':
        if (page > 0) page--;
        break;
      case 'next':
        if (page < totalPages - 1) page++;
        break;
      case 'last':
        page = totalPages - 1;
        break;
    }

    row = updateButtons(page, totalPages);
    await i.update({
      embeds: [addFooterToEmbed(embeds[page], page, totalPages)],
      components: [row],
    });
  });

  collector.on('end', () => {
    void interaction.editReply({ components: [] });
  });
}
