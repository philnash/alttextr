"use server";

import { LangflowClient } from "@datastax/langflow-client";
import { langflow } from "../../config";

const client = new LangflowClient({
  baseUrl: langflow.url,
  apiKey: langflow.apiKey,
});
const flow = client.flow(langflow.flowId);

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
        [langflow.chatInputId]: {
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
