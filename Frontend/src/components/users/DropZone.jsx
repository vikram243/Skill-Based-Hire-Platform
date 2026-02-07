import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";

export default function Dropzone({ setFormData, formData }) {
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      setError("");

      setFormData((prev) => {
        if (prev.documents.length + acceptedFiles.length > 5) {
          setError("You can upload only 5 documents");
          return prev;
        }

        return {
          ...prev,
          documents: [...prev.documents, ...acceptedFiles],
        };
      });
    },
    [setFormData]
  );

  const onDropRejected = () => {
    setError("You can upload only 5 documents");
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 5,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center"
    >
      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
      <input {...getInputProps()} />

      <p className="text-muted-foreground mb-2">
        {isDragActive
          ? "Drop the files here ..."
          : "Drag and drop files here, or click to select"}
      </p>

      <Button variant="outline" size="sm">
        Choose Files
      </Button>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {/* File list */}
      {formData.documents.length > 0 && (
        <ul className="mt-4 text-left text-sm">
          {formData.documents.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b py-1"
            >
              <span className="truncate">{file.name}</span>
              <button onClick={() => removeFile(index)}>
                <X className="w-4 h-4 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        {formData.documents.length} / 5 files selected
      </p>
    </div>
  );
}