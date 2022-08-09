import { InstallItem } from "@cpbuildtools/lib-node-utilities";
import DockerInstaller from "../installers/docker.installer";
import VsCodeInstaller from "../installers/vscode.installer";

export default [{ id: DockerInstaller.id }, { id: VsCodeInstaller.id }] as InstallItem[];
