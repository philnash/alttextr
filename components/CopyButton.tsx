import React, { useState } from "react";
import styles from "./ImageUploadWrapper.module.css";
import CopyIcon from "./icons/copy";
import SuccessIcon from "./icons/success";
import ErrorIcon from "./icons/error";

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

  let copyButtonTitle = "Copy to clipboard";
  if (copyButtonText === "success") {
    copyButtonTitle = "Copied!";
  } else if (copyButtonText === "error") {
    copyButtonTitle = "Failed to copy";
  }

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className={`${className || styles.copyButton} ${styles.button}`}
      aria-label="Copy text to clipboard"
      title={copyButtonTitle}
    >
      {copyButtonText === "default" && <CopyIcon />}
      {copyButtonText === "success" && <SuccessIcon />}
      {copyButtonText === "error" && <ErrorIcon />}
    </button>
  );
};

export default CopyButton;
