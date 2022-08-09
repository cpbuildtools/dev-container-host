import { exec, GlobalInstallerService } from "@cpbuildtools/lib-node-utilities";

export async function updateSelf() {
  await exec(`npm i -g @cpbuildtools/dev-host@latest`);
}

export async function updateHost() {
  // await exec(`npm i -g @cpbuildtools/dev-host@latest`);
}

export async function updateApplications() {
  // await exec(`npm i -g @cpbuildtools/dev-host@latest`);
}

export async function updateCore(): Promise<void> {
  await GlobalInstallerService.update((await import("../../_install_data_/lists/core.list")).default);
}
