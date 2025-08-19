"use client";
import React, { useState, useTransition } from "react";

import ImageUploader from "./ImageUploader";
import CopyButton from "./CopyButton";
import { uploadImageAction } from "../src/app/actions/upload";
import styles from "./ImageUploadWrapper.module.css";
import pageStyles from "../src/app/page.module.css";

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
    error?: string;
    altText?: string;
  } | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 4) {
      setResult({
        success: false,
        error: "File too large, please use files less than 4MB in size.",
      });
    } else {
      setResult(null);
    }
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

  const handleEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResult((prevState) => {
      if (!prevState) return prevState;
      return { ...prevState, altText: e.target.value || "" };
    });
  };

  const uploadDisabled =
    isPending || !uploadedFile || uploadedFile.size > 4 * 1024 * 1024;

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
          Instructions, important information, or context for the image:
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter any instructions or important points about the image..."
          rows={4}
          className={styles.textarea}
        />
        <p>
          The more detail you can add about the context the image is used in,
          the better the generated text will be.
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={`${styles.submitButton} ${styles.button}`}
          disabled={uploadDisabled}
        >
          {isPending ? "Uploading..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className={`${styles.clearButton} ${styles.button}`}
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
          <div className={styles.resultTextArea}>
            <textarea
              onChange={handleEdit}
              className={styles.textarea}
              value={result.altText}
              rows={4}
            ></textarea>
            <CopyButton textToCopy={result.altText || ""} />
          </div>
          <p>
            Check the text and edit it until you are happy. Or update the
            instructions above and try generating the text again.
          </p>
          <p>
            Alt text should be concise, descriptive, and tailored to the
            image&apos;s context and function. Use clear language to convey
            essential information and omit redundant phrases.
          </p>
          <p>
            See the following links for more tips on how to write good alt text:
          </p>
          <ul>
            <li>
              <a
                className={pageStyles.primary}
                href="https://developers.google.com/tech-writing/accessibility/self-study/write-alt-text"
              >
                Write helpful alt text (Google)
              </a>
            </li>
            <li>
              <a
                className={pageStyles.primary}
                href="https://webaim.org/techniques/alttext/"
              >
                Alternative Text (WebAIM)
              </a>
            </li>
            <li>
              <a
                className={pageStyles.primary}
                href="https://abilitynet.org.uk/resources/digital-accessibility/five-golden-rules-compliant-alt-text"
              >
                Five Golden Rules for Compliant Alt Text (AbilityNet)
              </a>
            </li>
          </ul>

          <p>
            <em>
              Remember that you are responsible for the text you use on a web
              page.
            </em>
          </p>
        </div>
      )}
    </form>
  );
};

export default ImageUploadWrapper;
