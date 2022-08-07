import { getContainerLaunchUrl, readJsonFile } from "@cpbuildtools/lib-node-utilities";
import glob from "fast-glob";
import Path from "path/posix";
import { DEFAULT_CONTAINER_ROOT, loadConfig } from "../config";

interface DevEnvironment {
  path: string;
  config: any;
  containers: DevContainer[];
}

interface DevContainer {
  id: string;
  name: string;
  owner: string;
  path: string;
  config: any;
  launchUrl?: string;
  hostLaunchUrl?: string;
  workspaces: DevWorkspace[];
}

interface DevWorkspace {
  name: string;
  container: string;
  path: string;
  internalPath: string;
  config: any;
  launchUrl?: string;
  hostLaunchUrl?: string;
}

async function loadEnvironmentData() {
  const config = await loadConfig();
  const root = config?.containerRoot ?? DEFAULT_CONTAINER_ROOT;

  const data: DevEnvironment = {
    path: root,
    config,
    containers: [],
  };

  const containerPaths = await glob(Path.join(root, "*/*/.devcontainer/devcontainer.json"), {
    dot: true,
  });
  for (const cPath of containerPaths) {
    const basePath = Path.dirname(Path.dirname(cPath));
    const id = basePath.slice(root.length + 1);
    const [owner, name] = id.split("/", 2);
    const def: DevContainer = {
      id,
      owner,
      name,
      path: basePath,
      launchUrl: await getContainerLaunchUrl(basePath),
      workspaces: [],
      config: await readJsonFile(cPath),
    };
    const workspacesRoot = Path.join(basePath, "workspaces");
    const workspaces = await glob("*.code-workspace", {
      cwd: workspacesRoot,
      dot: true,
    });

    for (const ws of workspaces) {
      const container = def.path.slice(root.length + 1);
      const name = ws.slice(0, -Path.extname(ws).length);
      const path = Path.join(workspacesRoot, ws);
      const internalPath = Path.join(def.config.workspaceFolder, ws);
      const launchUrl = await getContainerLaunchUrl(basePath, internalPath);

      def.workspaces.push({
        container,
        name,
        launchUrl,
        path,
        internalPath,
        config: await readJsonFile(path),
      });
    }

    data.containers.push(def);
  }

  return data;
}

export async function listContainers() {
  const env = await loadEnvironmentData();
  return env.containers;
}
