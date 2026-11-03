import { Config } from "@remotion/cli/config";

// Remotion CLI / Studio config. The server render path (@remotion/renderer)
// bundles remotion/index.ts programmatically and does not read this file, but
// `npx remotion studio` and `npx remotion render` use it.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./remotion/index.ts");

export {};
