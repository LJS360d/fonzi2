import {
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  ActionRowBuilder,
  type AnyComponentBuilder,
  type JSONEncodable,
  type RestOrArray,
} from 'discord.js';

export namespace ActionRow {
  export function actionRowData(
    ...components: RestOrArray<AnyComponentBuilder>
  ) {
    const actionRow = new ActionRowBuilder().addComponents(
      ...components.flat()
    );
    return actionRow as JSONEncodable<
      APIActionRowComponent<APIMessageActionRowComponent>
    >;
  }
}
