import { CommandModule } from "yargs";
import { RemoveContainerCommandArgs } from "./RemoveContainerCommand";

export const ContainerMenuCommand: CommandModule<{}, RemoveContainerCommandArgs> = {
  command: "$0",
  describe: false,
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "url of the container to clone",
      demandOption: true,
    }),
  handler: async (args): Promise<void> => {},
};
