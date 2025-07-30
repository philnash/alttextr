"use client";
import React, { useState, useTransition } from "react";

import ImageUploader from "./ImageUploader";
import CopyButton from "./CopyButton";
import { uploadImageAction } from "../src/app/actions/upload";
import styles from "./ImageUploadWrapper.module.css";

const ImageUploadWrapper: React.FC = () => {
  const [instructions, setInstructions] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
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

    // Clean up the preview URL and reset the state
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      setImageDimensions(null);
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
          <CopyButton textToCopy={result.altText || ""} />
        </div>
      )}
    </form>
  );
};

export default ImageUploadWrapper;
