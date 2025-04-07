import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../repo/api";

interface FileUploadProps {
  onUploadComplete?: (
    files: { filename: string; fileId: string; fileUrl: string }[]
  ) => void;
  previews?: string[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  minified?: boolean; // New prop for minified display
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  previews = [] as string[],
  multiple = false,
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  minified = false, // Default to full display
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>(previews);

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ filename: string; fileId: string; fileUrl: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => apiClient.uploadFiles(files),
    onSuccess: (data) => {
      setUploadedFiles((prev) => [...prev, ...data.files]);
      setSelectedFiles([]);
      setSelectedPreviews([]);
      if (onUploadComplete) {
        onUploadComplete(data.files);
      }
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
    }

    setSelectedFiles(multiple ? validFiles : [validFiles[0]]);

    // Generate previews for image files
    const previews = validFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
    }

    setSelectedFiles(multiple ? validFiles : [validFiles[0]]);

    // Generate previews for image files
    const previews = validFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  // Cleanup previews when component unmounts
  React.useEffect(() => {
    return () => {
      selectedPreviews.forEach(URL.revokeObjectURL);
    };
  }, [selectedPreviews]);

  if (minified) {
    return (
      <Box>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
          multiple={multiple}
          accept={accept}
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          startIcon={<CloudUploadIcon />}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <CircularProgress size={20} />
          ) : (
            "Upload File"
          )}
        </Button>
        {selectedFiles.length > 0 && (
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ ml: 1 }}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Confirm Upload"}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        multiple={multiple}
        accept={accept}
      />

      <Paper
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
          mb: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedPreviews.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            {selectedPreviews.map((preview, index) => (
              <Box
                key={index}
                component="img"
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/128/739/739249.png"
                }
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  mb: 1,
                }}
              />
            ))}
          </Box>
        ) : (
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
          />
        )}
        <Typography variant="h6" gutterBottom>
          Drag & Drop or Click to Upload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </Typography>
      </Paper>

      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files:
          </Typography>
          <List>
            {selectedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setSelectedPreviews((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            startIcon={
              uploadMutation.isPending ? <CircularProgress size={20} /> : null
            }
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Files"}
          </Button>
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Files:
          </Typography>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={file.fileId}
                secondaryAction={
                  <Box>
                    <Tooltip title="Copy URL">
                      <IconButton onClick={() => copyToClipboard(file.fileUrl)}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={() => {
                        setUploadedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                {file.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component="img"
                      src={file.fileUrl}
                      alt={file.filename}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <ListItemText
                      primary={file.filename}
                      secondary={file.fileUrl}
                    />
                  </Box>
                ) : (
                  <ListItemText
                    primary={file.filename}
                    secondary={file.fileUrl}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
