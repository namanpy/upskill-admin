import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import apiClient from "../../repo/api";

const CategoryList: React.FC = () => {
  const [searchString, setSearchString] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: [
      "categories",
      searchString,
      paginationModel.page,
      paginationModel.pageSize,
    ],
    queryFn: () =>
      apiClient.getCategories({
        searchString: searchString || undefined,
        skip: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
      }),
    staleTime: 30000,
  });

  const handleEdit = (categoryCode: string) => {
    navigate(`/category/edit/${categoryCode}`);
  };

  const columns: GridColDef[] = [
    {
      field: "categoryCode",
      headerName: "Code",
      width: 150,
    },
    {
      field: "categoryName",
      headerName: "Name",
      width: 200,
    },
    {
      field: "categoryDescription",
      headerName: "Description",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleEdit(params.row.categoryCode)}
          size="small"
          color="primary"
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Categories
          </Typography>

          <TextField
            label="Search Categories"
            variant="outlined"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            sx={{ width: "100%", maxWidth: 500 }}
          />

          <Box sx={{ width: "100%", height: "auto", minHeight: 400 }}>
            <DataGrid
              rows={categoriesData?.data || []}
              columns={columns}
              getRowId={(row) => row._id}
              loading={isLoading}
              disableRowSelectionOnClick
              autoHeight
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={categoriesData?.count || 0}
              paginationMode="server"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: 1,
                  borderColor: "divider",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CategoryList;
