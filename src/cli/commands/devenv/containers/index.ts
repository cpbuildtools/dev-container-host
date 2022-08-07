import { listContainers } from "../../../../lib/devenv/containers";
import { Argv, boolean, CommandModule } from "yargs";
import chalk from "chalk";
import { launchContainerUrl, printAsYaml } from "@cpbuildtools/lib-node-utilities";

interface CloneContainerCommandArgs {
  url: string;
}

export const CloneContainerCommand: CommandModule<{}, CloneContainerCommandArgs> = {
  command: "clone <url>",
  describe: "Clone a container",
  builder: (yargs) =>
    yargs.positional("url", {
      type: "string",
      describe: "url of the container to clone",
      required: true,
    }) as Argv<CloneContainerCommandArgs>,
  handler: async (args): Promise<void> => {},
};

interface OpenContainerCommandArgs {
  containerId: string;
  workspace?: string;
}

export const OpenContainerCommand: CommandModule<{}, OpenContainerCommandArgs> = {
  command: "open <containerId> [workspace]",
  describe: "Open a container in vscode",
  builder: (yargs) =>
    yargs
      .positional("containerId", {
        type: "string",
        describe: "owner/name",
        required: true,
      })
      .positional("workspace", {
        type: "string",
        describe: "name of the workspace to open",
      }) as Argv<OpenContainerCommandArgs>,
  handler: async (args): Promise<void> => {
    const containers = await listContainers();
    const container = containers.find((c) => c.id === args.containerId);
    if (container) {
      const workspace = container.workspaces.find((w) => w.name === args.workspace);
      const launchUrl = workspace?.launchUrl ?? container.launchUrl;
      if (launchUrl) {
        launchContainerUrl(launchUrl);
      }
    }
  },
};

interface CreateContainerCommandArgs {
  path: string;
  template: string;
}

export const CreateContainerCommand: CommandModule<{}, CreateContainerCommandArgs> = {
  command: "create <template> <path>",
  describe: "Create a container",
  builder: (yargs) =>
    yargs
      .positional("template", {
        type: "string",
        describe: "url of the container template to use",
        required: true,
      })
      .positional("path", {
        type: "string",
        describe: "url of the container template to use",
        required: true,
      }) as Argv<CreateContainerCommandArgs>,
  handler: async (args): Promise<void> => {},
};

interface RemoveContainerCommandArgs {
  path: string;
}

export const RemoveContainerCommand: CommandModule<{}, RemoveContainerCommandArgs> = {
  command: "remove <path>",
  describe: "Remove a container",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "url of the container to clone",
      required: true,
    }) as Argv<RemoveContainerCommandArgs>,
  handler: async (args): Promise<void> => {},
};
export const ContainerMenuCommand: CommandModule<{}, RemoveContainerCommandArgs> = {
  command: "$0",
  describe: false,
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "url of the container to clone",
      required: true,
    }) as Argv<RemoveContainerCommandArgs>,
  handler: async (args): Promise<void> => {},
};

interface ContainerListCommandArgs {
  long?: boolean;
  workspaces?: boolean;
}

export const ContainerListCommand: CommandModule<{}, ContainerListCommandArgs> = {
  command: "ls",
  describe: "List containers",
  builder: (yargs) =>
    yargs
      .option("long", {
        type: "boolean",
        alias: "l",
        default: false,
      })
      .option("workspaces", {
        type: "boolean",
        alias: "w",
        default: false,
      }),
  handler: async (args): Promise<void> => {
    const containers = await listContainers();
    console.group();
    containers.forEach((c) => {
      console.info(`${chalk.yellow(args.long ? c.path : c.id)}`);
      if (args.workspaces) {
        for (const ws of c.workspaces) {
          console.group();
          console.info(`${chalk.cyanBright(args.long ? ws.path : ws.name)}`);
          console.groupEnd();
        }
      }
    });
    console.groupEnd();
    console.info();
  },
};
interface ContainerInspectCommandArgs {
  containerId?: string;
}
export const ContainerInspectCommand: CommandModule<{}, ContainerInspectCommandArgs> = {
  command: "inspect <container-id>",
  //aliases: [],
  describe: "Show Details about a container",
  builder: (yargs) =>
    yargs.positional("containerId", {
      type: "string",
      required: true,
      default: undefined,
    }),
  handler: async (args): Promise<void> => {
    const containers = await listContainers();
    const container = containers.find((c) => c.id === args.containerId);
    if (container) {
      printAsYaml(
        {
          [container.id]: {
            owner: container.owner,
            name: container.name,
            launchUrl: container.launchUrl,
            workspaces: container.workspaces.map((ws) => ({
              name: ws.name,
              path: ws.path.slice(container.path.length + 1),
              launchUrl: ws.launchUrl,
            })),
          },
        },
        { cliColor: true }
      );
    }
    //console.log(container);
  },
};

export const ContainerCommand: CommandModule = {
  command: "container",
  describe: "Container Menu",
  builder: (yargs: Argv) =>
    yargs
      .command(ContainerMenuCommand)
      .command(ContainerListCommand)
      .command(ContainerInspectCommand)
      .command(OpenContainerCommand)
      .command(CloneContainerCommand)
      .command(CreateContainerCommand)
      .command(RemoveContainerCommand),
  handler: (args): void | Promise<void> => {},
};

module.exports = ContainerCommand;
