#!/usr/bin/env node

import { Command } from "commander";
import { generateCommand } from "./generate";
import { initCommand } from "./init";
import process from "node:process";

const program = new Command();

program
  .name("fastdoc")
  .description("AI-powered documentation generator for your codebase")
  .version("1.0.0");

program.addCommand(generateCommand);
program.addCommand(initCommand);
program.parse(process.argv);