"use server";

import { LangflowClient } from "@datastax/langflow-client";

if (!process.env.LANGFLOW_FLOW_ID) {
  throw new Error("LANGFLOW_FLOW_ID is not set in the environment variables");
}

const client = new LangflowClient({
  baseUrl: process.env.LANGFLOW_URL || "http://localhost:7860/",
  apiKey: process.env.LANGFLOW_API_KEY,
});
const flow = client.flow(process.env.LANGFLOW_FLOW_ID);

export async function uploadImageAction(formData: FormData) {
  try {
    // Extract the image file and instructions
    const imageFile = formData.get("image") as File | null;
    const instructions = formData.get("instructions") as string | null;

    // Validate required fields
    if (!imageFile) {
      return {
        success: false,
        error: "Image file is required",
      };
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      return {
        success: false,
        error: "Only image files are allowed",
      };
    }

    const upload = await flow.uploadFile(imageFile);
    const response = await flow.run(instructions ?? "", {
      tweaks: {
        "ChatInput-13MjU": {
          files: upload.filePath,
        },
      },
    });

    return {
      success: true,
      altText: response.chatOutputText(),
    };
  } catch (error) {
    console.error("Error processing upload:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
