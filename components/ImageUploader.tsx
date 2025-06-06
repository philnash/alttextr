"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image"; // Import next/image
import { useDropzone } from "react-dropzone";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onImageUpload(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Load image to get dimensions
        const imgElement = new window.Image();
        imgElement.onload = () => {
          setImageDimensions({
            width: imgElement.width,
            height: imgElement.height,
          });
        };
        imgElement.src = objectUrl;
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
    noClick: true,
  });

  // Calculate display dimensions while maintaining aspect ratio
  const getDisplayDimensions = () => {
    if (!imageDimensions) return { width: 200, height: 200 };

    const maxWidth = 800;
    const maxHeight = 600;
    const aspectRatio = imageDimensions.width / imageDimensions.height;

    let displayWidth = imageDimensions.width;
    let displayHeight = imageDimensions.height;

    // Scale down if image is larger than max dimensions
    if (displayWidth > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / aspectRatio;
    }

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }

    return {
      width: Math.round(displayWidth),
      height: Math.round(displayHeight),
    };
  };

  const displayDimensions = getDisplayDimensions();

  return (
    <div className={styles.inputGroup}>
      <label
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className={styles.previewImage}
            width={displayDimensions.width}
            height={displayDimensions.height}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <p>
            Drag &apos;n&apos; drop an image here, or click to select an image
          </p>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
