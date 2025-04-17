import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid as MuiGrid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import { fetchStats, updateStatActive, deleteStat } from "../../../repo/banners.api";
import { useNavigate } from "react-router-dom";
import { Stat } from "../../../types";

// Custom Theme (shared with CourseEditForm)
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff4081" },
    background: { default: "#f5f7fa", paper: "transparent" },
    error: { main: "#d32f2f" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1976d2" },
    h6: { fontWeight: 500, color: "#1976d2" },
    body1: { color: "#1976d2" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          transition: "all 0.2s",
          "&:hover": { transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.05)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          borderRadius: 12,
        },
      },
    },
  },
});

// Styled Components
const ImageContainer = styled(Box)({
  width: "100%",
  height: 150,
  overflow: "hidden",
  borderRadius: 8,
  marginTop: 10,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const StatsList = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load stats");
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedStat = await updateStatActive(id, !currentActive);
      setStats(stats.map((stat) => (stat._id === id ? updatedStat : stat)));
    } catch (err) {
      setError("Failed to update stat status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStat(id);
      setStats(stats.filter((stat) => stat._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError("Failed to delete stat");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} thickness={4} aria-label="Loading stats" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error" aria-live="assertive">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
          aria-label="Retry loading stats"
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Stats Dashboard
          </Typography>
          <MuiGrid container spacing={2}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat._id}>
                <Card aria-labelledby={`stat-label-${stat._id}`}>
                  <CardContent>
                    <Typography variant="h6" id={`stat-label-${stat._id}`}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Count: {stat.count}
                    </Typography>
                    <ImageContainer>
                      <img src={stat.imageUrl} alt={stat.label} />
                    </ImageContainer>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/stats/edit/${stat._id}`)}
                      aria-label={`Edit ${stat.label}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={stat.active ? <Cancel /> : <CheckCircle />}
                      onClick={() => handleToggleActive(stat._id, stat.active)}
                      color={stat.active ? "error" : "success"}
                      aria-label={stat.active ? `Deactivate ${stat.label}` : `Activate ${stat.label}`}
                    >
                      {stat.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => setDeleteDialogOpen(stat._id)}
                      aria-label={`Delete ${stat.label}`}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </MuiGrid>
        </Paper>
        <Dialog
          open={!!deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(null)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete the stat "
              {stats.find((stat) => stat._id === deleteDialogOpen)?.label}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(null)} aria-label="Cancel deletion">
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
              color="error"
              autoFocus
              aria-label="Confirm deletion"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default StatsList;