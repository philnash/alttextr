import { env } from "node:process";

if (!env.LANGFLOW_FLOW_ID) {
  throw new Error("LANGFLOW_FLOW_ID is not set in the environment variables");
}
if (!env.LANGFLOW_CHAT_INPUT_ID) {
  throw new Error(
    "LANGFLOW_CHAT_INPUT_ID is not set in the environment variables"
  );
}

export const langflow = {
  url: env.LANGFLOW_URL || "http://localhost:7860/",
  flowId: env.LANGFLOW_FLOW_ID,
  apiKey: env.LANGFLOW_API_KEY || "",
  chatInputId: env.LANGFLOW_CHAT_INPUT_ID,
};
