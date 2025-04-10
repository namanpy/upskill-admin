import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon, Sort as SortIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../repo/order.api";
import { debounce } from "lodash";

const ORDER_STATUS = {
  PENDING: { code: "PENDING", name: "Pending", color: "warning" },
  COMPLETED: { code: "COMPLETED", name: "Completed", color: "success" },
  CANCELLED: { code: "CANCELLED", name: "Cancelled", color: "error" },
  FAILED: { code: "FAILED", name: "Failed", color: "error" },
} as const;

const OrdersList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Create memoized debounce function
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchQuery(value);
      }, 500),
    []
  );

  // Update debounced value when search input changes
  useEffect(() => {
    debouncedSetSearch(searchQuery);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchQuery, debouncedSetSearch]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "orders",
      page,
      rowsPerPage,
      debouncedSearchQuery,
      sortDirection,
    ],
    queryFn: () =>
      apiClient.getOrders({
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        search: debouncedSearchQuery,
        sortByDate: sortDirection,
      }),
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusChip = (status: string) => {
    const statusConfig =
      ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS.PENDING;
    return (
      <Chip
        label={statusConfig.name}
        color={statusConfig.color as any}
        size="small"
      />
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading orders: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search orders..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={toggleSortDirection}
            title="Toggle sort direction"
          >
            <SortIcon
              sx={{
                transform: sortDirection === "desc" ? "none" : "scaleY(-1)",
              }}
            />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.user.username}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.student ? (
                      <>
                        <Typography variant="body2">
                          {order.student.fullName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.student.college || "No college"}
                        </Typography>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.batch.batchCode}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(order.batch.startDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ₹{order.totalAmount}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Paid: ₹{order.amountPaid}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default OrdersList;
