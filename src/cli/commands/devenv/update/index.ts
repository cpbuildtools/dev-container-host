import { CommandModule } from "yargs";
import { updateCore } from "../../../../lib/devenv/install/update";

export const UpdateCommand: CommandModule = {
  command: "update",
  describe: "update",
  builder: (yargs) => yargs,
  handler: async (args): Promise<void> => {
    await updateCore();
  },
};

module.exports = UpdateCommand;
