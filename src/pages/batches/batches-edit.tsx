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
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../repo/api";
import TeacherSearch from "../../components/teacher-search";
import type { Teacher, CourseDisplay } from "../../repo/api";
import CourseSearch from "../../components/course-search";
import { CourseData } from "../courses/course-add";
import { Autocomplete } from "@mui/material";
// Import the FileUpload component
import FileUpload from "../../components/file-upload";

interface BatchForm {
  course: Pick<CourseData, "_id" | "courseName" | "courseCode" | "courseMode">;
  batchCode: string;
  startDate: string;
  startTime: string;
  totalSeats: number;
  remainingSeats: number;
  duration: string;
  teacher: string;
  active: boolean;
  imageUrl?: string;
}

const BatchEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Pick<
    CourseDisplay,
    "_id" | "courseName" | "courseCode" | "courseMode"
  > | null>(null);

  const [batch, setBatch] = useState<BatchForm>({
    course: {
      _id: "",
      courseName: "",
      courseCode: "",
      courseMode: "",
    },
    batchCode: "",
    startDate: "",
    startTime: "",
    totalSeats: 0,
    remainingSeats: 0,
    duration: "",
    teacher: "",
    active: false,
  });

  // Fetch batch data
  const {
    data: batchData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["batch", id],
    queryFn: () => apiClient.getBatchById(id!),
    enabled: !!id,
  });

  // Update form when batch data is loaded
  useEffect(() => {
    if (batchData) {
      // Convert course data to the expected format
      const courseData: Pick<
        CourseData,
        "_id" | "courseName" | "courseCode" | "courseMode"
      > = {
        _id: batchData.batch.course._id,
        courseName: batchData.batch.course.courseName,
        courseCode: batchData.batch.course.courseCode,
        courseMode: batchData.batch.course.courseMode,
      };

      // Format time from number to string (HH:MM)
      const startTimeStr =
        typeof batchData.batch.startTime === "number"
          ? `${Math.floor(batchData.batch.startTime / 100)
              .toString()
              .padStart(2, "0")}:${(batchData.batch.startTime % 100)
              .toString()
              .padStart(2, "0")}`
          : batchData.batch.startTime;

      setBatch({
        course: courseData,
        batchCode: batchData.batch.batchCode,
        startDate: batchData.batch.startDate,
        startTime: startTimeStr,
        totalSeats: batchData.batch.totalSeats,
        remainingSeats: batchData.batch.remainingSeats,
        duration: batchData.batch.duration,
        teacher: batchData.batch.teacher._id,
        active: batchData.batch.active,
        imageUrl: batchData.batch.imageUrl,
      });

      // Set selected teacher
      setSelectedTeacher(batchData.batch.teacher);

      // Set selected course as a CourseDisplay object
      setSelectedCourse({
        _id: batchData.batch.course._id!,
        courseName: batchData.batch.course.courseName,
        courseCode: batchData.batch.course.courseCode,
        courseMode: batchData.batch.course.courseMode,
      });
    }
  }, [batchData]);

  // Update the updateBatchMutation to use imageUrl instead of imageFile
  const updateBatchMutation = useMutation({
    mutationFn: async (batchData: BatchForm) => {
      return apiClient.updateBatch(id!, {
        course: batchData.course._id!,
        batchCode: batchData.batchCode,
        startDate: batchData.startDate,
        startTime: batchData.startTime,
        totalSeats: batchData.totalSeats,
        remainingSeats: batchData.remainingSeats,
        duration: batchData.duration,
        teacher: selectedTeacher?._id || "",
        active: batchData.active,
        imageUrl: batchData.imageUrl, // Use imageUrl instead of sending a file
      });
    },
    onSuccess: () => {
      navigate("/batches/list");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateBatchMutation.mutate(batch);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBatch((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update batch state when course is selected
  useEffect(() => {
    if (selectedCourse) {
      setBatch((prev) => ({
        ...prev,
        course: {
          ...batch.course,
          _id: selectedCourse._id,
          courseName: selectedCourse.courseName,
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading batch data...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Error loading batch:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Batch
        </Typography>

        {updateBatchMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error updating batch:{" "}
            {updateBatchMutation.error instanceof Error
              ? updateBatchMutation.error.message
              : "Unknown error"}
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
                    // Only update remainingSeats if it was equal to totalSeats before
                    remainingSeats:
                      prev.totalSeats === prev.remainingSeats
                        ? value
                        : prev.remainingSeats,
                  }));
                }}
                required
              />

              <TextField
                type="number"
                label="Remaining Seats"
                name="remainingSeats"
                value={batch.remainingSeats}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setBatch((prev) => ({
                    ...prev,
                    remainingSeats: value,
                  }));
                }}
                required
                helperText="Number of seats still available"
                inputProps={{ max: batch.totalSeats }}
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
            // Replace the current image upload section with FileUpload
            component
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Batch Image
              </Typography>
              {batch.imageUrl && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={batch.imageUrl}
                    alt="Current batch image"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                  <Typography variant="caption" display="block">
                    Current image
                  </Typography>
                </Box>
              )}
              <FileUpload
                minified={true}
                accept="image/*"
                onUploadComplete={(files) => {
                  if (files.length > 0) {
                    setBatch((prev) => ({
                      ...prev,
                      imageUrl: files[0].fileUrl,
                    }));
                    // No need to set imageFile since we're using the URL directly
                    setImageFile(null);
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
                disabled={updateBatchMutation.isPending}
              >
                {updateBatchMutation.isPending ? "Updating..." : "Update Batch"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BatchEdit;
