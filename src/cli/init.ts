import { Command } from "commander";
import promises = require("inspector/promises");

export const initCommand = new Command("init")
  .description("Create a .fastdocrc configuration file")
  .action(async () => {
    promises.console.log("⚙️  Initializing fastdoc configuration...");
    // TODO: implementation coming next
  });