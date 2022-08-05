import { Argv, CommandModule } from "yargs";

interface Asdfg {
  id: String;
}
export default {
  command: "sayhi",
  builder: (yargs) => yargs,
  handler: (args) => {},
} as CommandModule<Asdfg, Asdfg>;
