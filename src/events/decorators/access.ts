import { CommandInteractionsHandler } from "../handlers/commands/commands.handler";
import { commandObjectsKey } from "./command.decorator";

export class DecoratorsMetadataAccess {
	static get commands() {
		return (
			Reflect.getOwnMetadata(commandObjectsKey, CommandInteractionsHandler.prototype) ||
			[]
		);
	}
}
