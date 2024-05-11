import {
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  ActionRowBuilder,
  type AnyComponentBuilder,
  type JSONEncodable,
  type RestOrArray,
} from 'discord.js';

export class ActionRow {
  static actionRowData(...components: RestOrArray<AnyComponentBuilder>) {
    const actionRow = new ActionRowBuilder().addComponents(...components.flat());
    return actionRow as JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>;
  }
}
