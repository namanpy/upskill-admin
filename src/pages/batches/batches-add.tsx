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
  MenuItem,
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
import { CourseData } from "../courses/course-add";
import { Autocomplete } from "@mui/material";

interface BatchForm {
  course: Pick<CourseData, "_id" | "courseName" | "courseCode" | "courseMode">;
  startDate: string;
  startTime: string;
  totalSeats: number;
  remainingSeats: number;
  duration: string;
  teacher: string;
  active: boolean;
  imageUrl?: string;
  batchCode: string; // Add batchCode field
}

const BatchAdd = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [batch, setBatch] = useState<BatchForm>({
    course: {
      courseName: "",
      courseCode: "",
      courseMode: "",
    },
    startDate: "",
    startTime: "09:00", // Default to 9 AM
    totalSeats: 30,
    remainingSeats: 30,
    duration: "",
    teacher: "",
    active: true,
    batchCode: "", // Initialize batchCode
  });

  const createBatchMutation = useMutation({
    mutationFn: async (batchData: BatchForm) => {
      return apiClient.createBatch(
        {
          ...batchData,
          course: batchData.course._id!,
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

  const [selectedCourse, setSelectedCourse] = useState<Pick<
    CourseDisplay,
    "_id" | "courseName" | "courseCode" | "courseMode"
  > | null>(null);

  // Update batch state when course is selected
  useEffect(() => {
    if (selectedCourse) {
      setBatch((prev) => ({
        ...prev,
        course: {
          ...batch.course,
          ...selectedCourse,
        },
      }));
    }
  }, [selectedCourse]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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

            <TextField
              label="Batch Code"
              name="batchCode"
              value={batch.batchCode}
              onChange={handleChange}
              required
              fullWidth
              helperText="Enter a unique code for this batch"
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

              <Autocomplete
                value={batch.startTime}
                onChange={(_, newValue) => {
                  setBatch((prev) => ({
                    ...prev,
                    startTime: newValue || "09:00",
                  }));
                }}
                freeSolo
                options={timeOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Start Time"
                    name="startTime"
                    required
                    helperText="Select or enter time (HH:MM format)"
                  />
                )}
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
                helperText="Duration in days"
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
              <input type="file" accept="image/*" onChange={handleFileChange} />
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
