import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../repo/api";
import { Edit, Event, AccessTime, Group, Person } from "@mui/icons-material";

const BatchesList = () => {
  const {
    data: batchesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: () => apiClient.getBatches(),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time % 1) * 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">
          Error loading batches: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Batches
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {batchesData?.batches.map((batch) => (
          <Box
            key={batch._id}
            sx={{
              flexBasis: {
                xs: "100%",
                md: "calc(50% - 24px)",
                lg: "calc(33.333% - 24px)",
              },
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  height: 200,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={batch.imageUrl || batch.course.courseImage}
                  alt={batch.course.courseName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Chip
                  label={batch.active ? "Active" : "Inactive"}
                  color={batch.active ? "success" : "default"}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {batch.course.courseName}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Event sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    Starts: {formatDate(batch.startDate)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    Time: {batch.startTime}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Group sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    Seats: {batch.remainingSeats}/{batch.totalSeats}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    Teacher: {batch.teacher.name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={batch.teacher.social_links?.avatar}
                      alt={batch.teacher.bio}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {batch.teacher.experience} exp.
                    </Typography>
                  </Box>
                  <Tooltip title="Edit Batch">
                    <IconButton
                      size="small"
                      onClick={() => {
                        window.location.href = `/batches/edit/${batch._id}`;
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BatchesList;
