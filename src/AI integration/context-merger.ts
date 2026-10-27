import { ChatContext } from "./context";

export function mergeContext(
  args: Record<string, unknown>,
  context: ChatContext
) {
  return {
    ...context,
    ...args,
  };
}
