"use client";
import React, { useState, useTransition } from "react";
import ImageUploader from "./ImageUploader";
import { uploadImageAction } from "../src/app/actions/upload";
import styles from "./ImageUploadWrapper.module.css";

const ImageUploadWrapper: React.FC = () => {
  const [instructions, setInstructions] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <ImageUploader onImageUpload={handleImageUpload} />

      <div className={styles.inputGroup}>
        <label htmlFor="instructions" className={styles.label}>
          Instructions or Important Points:
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

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isPending || !uploadedFile}
      >
        {isPending ? "Uploading..." : "Submit"}
      </button>

      {!isPending && result && !result.success && (
        <div className={styles.error}>
          <strong>Error:</strong> {result.error}
        </div>
      )}

      {!isPending && result && result.success && (
        <div className={styles.result}>
          <h3>Generated Alt Text</h3>
          <p>{result.altText}</p>
        </div>
      )}
    </form>
  );
};

export default ImageUploadWrapper;
