import React, { useState } from "react";
import styles from "./ImageUploadWrapper.module.css";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
  const [copyButtonText, setCopyButtonText] = useState<
    "default" | "success" | "error"
  >("default");

  const copyToClipboard = async () => {
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopyButtonText("success");
        setTimeout(() => setCopyButtonText("default"), 2000); // Reset after 2 seconds
      } catch {
        setCopyButtonText("error");
        setTimeout(() => setCopyButtonText("default"), 2000); // Reset after 2 seconds
      }
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className={className || styles.copyButton}
      aria-label="Copy text to clipboard"
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
          stroke="var(--color-success)"
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
          stroke="var(--color-error)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      )}
    </button>
  );
};

export default CopyButton;
