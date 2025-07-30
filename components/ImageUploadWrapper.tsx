"use client";
import React, { useState, useTransition } from "react";

import ImageUploader from "./ImageUploader";
import { uploadImageAction } from "../src/app/actions/upload";
import styles from "./ImageUploadWrapper.module.css";

const ImageUploadWrapper: React.FC = () => {
  const [instructions, setInstructions] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copyButtonText, setcopyButtonText] = useState<string>("default");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    fileInfo?: {
      name: string;
      type: string;
      size: number;
      lastModified: number;
    };
    instructions?: string;
    altText?: string;
  } | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      setResult({ success: false, error: "Please select an image file" });
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedFile);
    formData.append("instructions", instructions);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      setResult(result);
    });
  };

  const handleClear = () => {
    setUploadedFile(null);
    setResult(null);
    setInstructions("");
    setcopyButtonText("default");

    // Clean up the preview URL and reset the state
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      setImageDimensions(null);
    }
  };

  const copyToClipboard = async () => {
    if (result?.altText) {
      try {
        await navigator.clipboard.writeText(result.altText);
        setcopyButtonText("success");
        setTimeout(() => setcopyButtonText("default"), 2000); // Reset after 2 seconds
      } catch {
        setcopyButtonText("error");
        setTimeout(() => setcopyButtonText("default"), 2000); // Reset after 2 seconds
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <ImageUploader
        onImageUpload={handleImageUpload}
        preview={preview}
        imageDimensions={imageDimensions}
        setPreview={setPreview}
        setImageDimensions={setImageDimensions}
      />

      <div className={styles.inputGroup}>
        <label htmlFor="instructions" className={styles.label}>
          Instructions or important points:
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter any instructions or important points about the image..."
          rows={4}
          className={styles.textarea}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending || !uploadedFile}
        >
          {isPending ? "Uploading..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          disabled={isPending || (!uploadedFile && !result && !instructions)}
        >
          Clear
        </button>
      </div>

      {!isPending && result && !result.success && (
        <div className={styles.error}>
          <strong>Error:</strong> {result.error}
        </div>
      )}

      {!isPending && result && result.success && (
        <div className={styles.result}>
          <h3>Generated Alt Text</h3>

          <p>{result.altText}</p>
          <button
            type="button"
            onClick={copyToClipboard}
            className={styles.copyButton}
            aria-label="Copy alt text to clipboard"
            title={
              copyButtonText === "default"
                ? "Copy to clipboard"
                : copyButtonText === "success"
                ? "Copied!"
                : "Failed to copy"
            }
          >
            {copyButtonText === "default" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
            {copyButtonText === "success" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            {copyButtonText === "error" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F44336"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default ImageUploadWrapper;
