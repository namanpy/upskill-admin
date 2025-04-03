import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../repo/api";
import { useNavigate } from "react-router-dom";

const CategoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryCode: "",
    categoryDescription: "",
    categoryImage: "",
    featured: false,
    active: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addCategoryMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.addCategory(data),
    onSuccess: () => {
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/categories");
      }, 2000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCategoryMutation.mutate(formData);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Add New Category
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box sx={{ flex: "1 1 calc(50% - 1.5rem)", minWidth: "250px" }}>
                <TextField
                  fullWidth
                  required
                  label="Category Name"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  variant="outlined"
                  error={addCategoryMutation.isError}
                />
              </Box>

              <Box sx={{ flex: "1 1 calc(50% - 1.5rem)", minWidth: "250px" }}>
                <TextField
                  fullWidth
                  required
                  label="Category Code"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  placeholder="Enter category code"
                  variant="outlined"
                  error={addCategoryMutation.isError}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  required
                  label="Category Image URL"
                  name="categoryImage"
                  value={formData.categoryImage}
                  onChange={handleChange}
                  placeholder="Enter category image URL"
                  variant="outlined"
                  error={addCategoryMutation.isError}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Description"
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  variant="outlined"
                  error={addCategoryMutation.isError}
                />
              </Box>

              <Box sx={{ flex: "1 1 calc(50% - 1.5rem)", minWidth: "250px" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={handleChange}
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Category"
                />
              </Box>

              <Box sx={{ flex: "1 1 calc(50% - 1.5rem)", minWidth: "250px" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={handleChange}
                      name="active"
                      color="primary"
                    />
                  }
                  label="Active Status"
                />
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/categories")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={addCategoryMutation.isPending}
                  sx={{ minWidth: 150 }}
                >
                  {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                </Button>
              </Box>
            </Box>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity="success" sx={{ width: "100%" }} elevation={6}>
              Category added successfully!
            </Alert>
          </Snackbar>

          {addCategoryMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }} elevation={6}>
              Failed to add category. Please try again.
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CategoryAdd;
