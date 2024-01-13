import { assert, test } from "vitest";
import { Fonzi2Client, Logger, getRegisteredCommands } from "../dist";
import env from "./mocks/env";
import ClientEventsHandler from "./mocks/handlers/client.events.handler";
import options from "./mocks/options";

test("Client - Bot login", async () => {

  await new Promise<void>(async (resolve) => {
    const client = new Fonzi2Client(env.TOKEN, options, [
      new ClientEventsHandler(getRegisteredCommands())
    ]);


    client.on("ready", async () => {
      try {
        assert.equal(client.user?.displayName, "Fonzi 2");
      } catch (err: any) {
        Logger.error(err);
        assert.equal(false, true);
      } finally {
        resolve();
      }
    });
  });
});
