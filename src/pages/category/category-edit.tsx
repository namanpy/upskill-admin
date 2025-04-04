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
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../../repo/api";
import { useNavigate, useParams } from "react-router-dom";

interface Category {
  categoryName: string;
  categoryCode: string;
  categoryDescription: string;
  categoryImage: string;
  featured: boolean;
  active: boolean;
}

const CategoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const { categoryCode } = useParams<{ categoryCode: string }>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState<string>("");

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["category", categoryCode],
    queryFn: () => apiClient.getCategoryByCode({ categoryCode: categoryCode! }),
    enabled: !!categoryCode,
  });

  const [formData, setFormData] = useState<Category>({
    categoryName: categoryData?.categoryName || "",
    categoryCode: categoryData?.categoryCode || "",
    categoryDescription: categoryData?.categoryDescription || "",
    categoryImage: categoryData?.categoryImage || "",
    featured: categoryData?.featured || false,
    active: categoryData?.active || true,
  });

  // Update form data when category data is fetched
  React.useEffect(() => {
    if (categoryData) {
      setFormData({
        categoryName: categoryData.categoryName,
        categoryCode: categoryData.categoryCode,
        categoryDescription: categoryData.categoryDescription,
        categoryImage: categoryData.categoryImage,
        featured: categoryData.featured,
        active: categoryData.active,
      });
    }
  }, [categoryData]);

  const updateCategoryMutation = useMutation({
    mutationFn: () => apiClient.updateCategory(categoryData!._id, formData),
    onSuccess: () => {
      setError("");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/categories");
      }, 2000);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to update category");
      setOpenSnackbar(true);
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
    updateCategoryMutation.mutate();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Edit Category
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
                  variant="outlined"
                  error={!!error}
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
                  variant="outlined"
                  error={!!error}
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
                  variant="outlined"
                  error={!!error}
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
                  variant="outlined"
                  error={!!error}
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
                  disabled={updateCategoryMutation.isPending}
                  sx={{ minWidth: 150 }}
                >
                  {updateCategoryMutation.isPending
                    ? "Updating..."
                    : "Update Category"}
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
            <Alert
              severity={error ? "error" : "success"}
              sx={{ width: "100%" }}
              elevation={6}
            >
              {error || "Category updated successfully!"}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Box>
  );
};

export default CategoryEdit;
