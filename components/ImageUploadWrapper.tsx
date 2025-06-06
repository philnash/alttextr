"use client";
import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import styles from "./ImageUploadWrapper.module.css";

const ImageUploadWrapper: React.FC = () => {
  const [instructions, setInstructions] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    console.log("Uploaded image:", file);
    setUploadedFile(file);
    // Handle the image file (e.g., upload to server, display preview)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { file: uploadedFile, instructions });
    // Handle form submission logic here
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
      >
        Submit
      </button>
    </form>
  );
};

export default ImageUploadWrapper;
