import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../repo/api";
import { useNavigate } from "react-router-dom";

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories({ limit: 100 }),
    staleTime: 300000, // 5 minutes
  });

  // Fetch courses with filters, sorting and search
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "courses",
      paginationModel,
      sortModel,
      selectedCategories,
      searchQuery,
    ],
    queryFn: async () =>
      await apiClient.getCourseDisplay({
        skip: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
        sort: sortModel.map((sort) => ({
          field: sort.field,
          order: sort.sort as "asc" | "desc",
        })),
        categoryIds: selectedCategories.length > 0 ? selectedCategories : [],
        search: searchQuery,
      }),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const handleCategoryChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const columns: GridColDef[] = [
    {
      field: "courseCode",
      headerName: "Code",
      width: 130,
      sortable: true,
      filterable: false,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      width: 200,
      sortable: true,
      filterable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: (params: any) => params.categoryName,
    },
    {
      field: "courseMode",
      headerName: "Mode",
      width: 130,
      sortable: true,
      filterable: false,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      ),
    },
    {
      field: "courseDuration",
      headerName: "Duration (hrs)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: false,
    },
    {
      field: "price",
      headerName: "Price",
      width: 180,
      sortable: true,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            sx={{
              textDecoration: "line-through",
              fontSize: "0.875rem",
            }}
          >
            ₹{params.row.originalPrice}
          </Typography>
          <Typography color="primary">₹{params.row.discountedPrice}</Typography>
        </Stack>
      ),
    },
    {
      field: "active",
      headerName: "Status",
      width: 130,
      sortable: true,
      filterable: false,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/courses/edit/${params.row.courseCode}`)}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course List
        </Typography>

        {/* Search and Filter Controls */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Search Courses"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <FormControl
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          >
            <InputLabel sx={{ backgroundColor: "background.paper", px: 1 }}>
              Filter by Categories
            </InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={
                <OutlinedInput
                  label="Filter by Categories"
                  sx={{
                    borderRadius: 2,
                    "&:focus": {
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                  }}
                />
              }
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.8,
                    py: 0.5,
                  }}
                >
                  {selected.map((value) => {
                    const category = categoriesData?.data.find(
                      (cat) => cat._id === value
                    );
                    return (
                      <Chip
                        key={value}
                        label={category?.categoryName}
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          backgroundColor: "primary",
                          color: "text.primary",
                          "&:hover": {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {categoriesData?.data.map((category) => (
                <MenuItem
                  key={category._id}
                  value={category._id}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    "&:hover": {
                      backgroundColor: "primary.lighter",
                    },
                  }}
                >
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 600, width: "100%" }}>
          {error ? (
            <Typography color="error">
              Error loading courses: {error.message}
            </Typography>
          ) : (
            <DataGrid
              rows={coursesData?.data || []}
              columns={columns}
              getRowId={(row) => row._id}
              rowCount={coursesData?.count || 0}
              loading={isLoading}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode="server"
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              disableRowSelectionOnClick
              autoHeight
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CourseList;
