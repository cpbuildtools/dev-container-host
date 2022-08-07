import { CommandModule } from "yargs";

export const RemoveContainerCommand: CommandModule<{}, RemoveContainerCommandArgs> = {
  command: "remove <path>",
  describe: "Remove a container",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "url of the container to clone",
      demandOption: true,
    }),
  handler: async (args): Promise<void> => {
    throw new Error("NYI");
  },
};
export interface RemoveContainerCommandArgs {
  path: string;
}
