import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../../repo/api";
import FileUpload from "../../components/file-upload";
import TeacherSearch from "../../components/teacher-search";
import type { Teacher } from "../../repo/api";
import CourseSearch from "../../components/course-search";
import type { CourseDisplay } from "../../repo/api";

interface BatchForm {
  course: string;
  startDate: string;
  startTime: number;
  totalSeats: number;
  remainingSeats: number;
  duration: string;
  teacher: string;
  active: boolean;
  imageUrl?: string;
}

const BatchAdd = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [batch, setBatch] = useState<BatchForm>({
    course: "",
    startDate: "",
    startTime: 9, // Default to 9 AM
    totalSeats: 30,
    remainingSeats: 30,
    duration: "",
    teacher: "",
    active: true,
  });

  const createBatchMutation = useMutation({
    mutationFn: async (batchData: BatchForm) => {
      return apiClient.createBatch(
        {
          ...batchData,
          teacher: selectedTeacher?._id || "",
        },
        imageFile || undefined
      );
    },
    onSuccess: () => {
      navigate("/batches/list");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createBatchMutation.mutate(batch);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBatch((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [selectedCourse, setSelectedCourse] = useState<CourseDisplay | null>(
    null
  );

  // Update batch state when course is selected
  useEffect(() => {
    if (selectedCourse) {
      setBatch((prev) => ({
        ...prev,
        course: selectedCourse._id,
      }));
    }
  }, [selectedCourse]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Batch
        </Typography>

        {createBatchMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error creating batch: {createBatchMutation.error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "grid", gap: 3 }}>
            <CourseSearch
              value={selectedCourse}
              onChange={setSelectedCourse}
              label="Select Course"
              required
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
              }}
            >
              <DatePicker
                label="Start Date"
                value={batch.startDate ? new Date(batch.startDate) : null}
                onChange={(newValue) => {
                  setBatch((prev) => ({
                    ...prev,
                    startDate: newValue?.toISOString() || "",
                  }));
                }}
              />

              <TextField
                type="number"
                label="Start Time (24h)"
                name="startTime"
                value={batch.startTime}
                onChange={handleChange}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
                required
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
              }}
            >
              <TextField
                type="number"
                label="Total Seats"
                name="totalSeats"
                value={batch.totalSeats}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setBatch((prev) => ({
                    ...prev,
                    totalSeats: value,
                    remainingSeats: value,
                  }));
                }}
                required
              />

              <TextField
                label="Duration"
                name="duration"
                value={batch.duration}
                onChange={handleChange}
                required
                helperText="e.g., 2 months, 12 weeks"
              />
            </Box>

            <TeacherSearch
              value={selectedTeacher}
              onChange={setSelectedTeacher}
              label="Select Teacher"
              required
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Batch Image
              </Typography>
              <FileUpload
                accept="image/*"
                multiple={false}
                onUploadComplete={(files) => {
                  if (files.length > 0) {
                    setBatch((prev) => ({
                      ...prev,
                      imageUrl: files[0].fileUrl,
                    }));
                  }
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={batch.active}
                  onChange={(e) => {
                    setBatch((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }));
                  }}
                  name="active"
                />
              }
              label="Active"
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={createBatchMutation.isPending}
              >
                {createBatchMutation.isPending ? "Creating..." : "Create Batch"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BatchAdd;
