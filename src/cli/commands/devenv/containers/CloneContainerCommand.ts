import { CommandModule } from "yargs";

export const CloneContainerCommand: CommandModule<{}, CloneContainerCommandArgs> = {
  command: "clone <url>",
  describe: "Clone a container",
  builder: (yargs) =>
    yargs.positional("url", {
      type: "string",
      describe: "url of the container to clone",
      demandOption: true,
    }),
  handler: async (args): Promise<void> => {
    throw new Error("NYI");
  },
};

interface CloneContainerCommandArgs {
  url: string;
}
