import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { fetchDemoSessions, deleteDemoSession } from '../../repo/banners.api';
import { DemoSession } from '../../types';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DemoSessionsList = () => {
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counselHubFilter, setCounselHubFilter] = useState('all');
  const [upskillLabFilter, setUpskillLabFilter] = useState('all');
  const [sortType, setSortType] = useState('latest'); // Default to latest
  const [tabValue, setTabValue] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getDemoSessions = async () => {
      try {
        setLoading(true);
        const data = await fetchDemoSessions();
        // Sort by latest first by default
        const sortedData = sortSessions(data, 'latest');
        setDemoSessions(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load demo sessions');
        setLoading(false);
      }
    };
    getDemoSessions();
  }, []);

  const sortSessions = (sessions: DemoSession[], sort: string) => {
    return [...sessions].sort((a, b) => {
      switch (sort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'nameAsc':
          return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });
        case 'nameDesc':
          return b.fullName.localeCompare(a.fullName, undefined, { sensitivity: 'base' });
        default:
          return 0;
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDemoSession(id);
      setDemoSessions(demoSessions.filter((session) => session._id !== id));
    } catch (err) {
      setError('Failed to delete demo session');
    } finally {
      setOpenDeleteDialog(false);
      setSessionToDelete(null);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSessionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSessionToDelete(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const resetFilters = () => {
    setCounselHubFilter('all');
    setUpskillLabFilter('all');
    setSortType('latest'); // Reset to default sort
  };

  // Filter function with robust date handling
  const filterByTime = (sessions: DemoSession[], filter: string) => {
    const now = new Date();
    return sessions.filter((session) => {
      const createdAt = new Date(session.createdAt);
      if (isNaN(createdAt.getTime())) return false; // Skip invalid dates
      switch (filter) {
        case 'month': {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          return createdAt >= lastMonth;
        }
        case 'week': {
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          return createdAt >= lastWeek;
        }
        case 'day': {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return createdAt >= yesterday;
        }
        default:
          return true;
      }
    });
  };

  const counselHubSessions = sortSessions(
    filterByTime(
      demoSessions.filter((session) => session.sourse === 'counselHub'),
      counselHubFilter
    ),
    sortType
  );

  const upskillLabSessions = sortSessions(
    filterByTime(
      demoSessions.filter((session) => session.sourse !== 'counselHub'),
      upskillLabFilter
    ),
    sortType
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading demo sessions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <Typography color="error" mb={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Demo Sessions
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="demo sessions tabs"
          >
            <Tab label="CounselHub" {...a11yProps(0)} />
            <Tab label="UpskillLab" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* CounselHub Tab Panel */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">CounselHub Sessions</Typography>
            <Box display="flex" gap={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Filter</InputLabel>
                <Select
                  value={counselHubFilter}
                  onChange={(e) => setCounselHubFilter(e.target.value as string)}
                  label="Time Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="day">Last Day</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as string)}
                  label="Sort By"
                >
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                  <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Reset all filters and sort">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </Tooltip>
              <CSVLink data={counselHubSessions} filename="counselHub_sessions.csv">
                <Button variant="contained" color="primary">
                  Export to CSV
                </Button>
              </CSVLink>
            </Box>
          </Box>

          <Table
            size="medium"
            sx={{
              '& .MuiTableRow-root:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counselHubSessions.length > 0 ? (
                counselHubSessions.map((session, index) => (
                  <TableRow
                    key={session._id}
                    sx={{ backgroundColor: index % 2 === 0 ? 'inherit' : 'action.disabledBackground' }}
                  >
                    <TableCell>{session.fullName}</TableCell>
                    <TableCell>{session.email}</TableCell>
                    <TableCell>{session.phoneNumber}</TableCell>
                    <TableCell>{session.course}</TableCell>
                    <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit session">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate(`/demosessions/edit/${session._id}`)}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete session">
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(session._id)}
                          >
                            Delete
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No CounselHub sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>

        {/* UpskillLab Tab Panel */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">UpskillLab Sessions</Typography>
            <Box display="flex" gap={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Filter</InputLabel>
                <Select
                  value={upskillLabFilter}
                  onChange={(e) => setUpskillLabFilter(e.target.value as string)}
                  label="Time Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="day">Last Day</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as string)}
                  label="Sort By"
                >
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                  <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Reset all filters and sort">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </Tooltip>
              <CSVLink data={upskillLabSessions} filename="upskillLab_sessions.csv">
                <Button variant="contained" color="primary">
                  Export to CSV
                </Button>
              </CSVLink>
            </Box>
          </Box>

          <Table
            size="medium"
            sx={{
              '& .MuiTableRow-root:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upskillLabSessions.length > 0 ? (
                upskillLabSessions.map((session, index) => (
                  <TableRow
                    key={session._id}
                    sx={{ backgroundColor: index % 2 === 0 ? 'inherit' : 'action.disabledBackground' }}
                  >
                    <TableCell>{session.fullName}</TableCell>
                    <TableCell>{session.email}</TableCell>
                    <TableCell>{session.phoneNumber}</TableCell>
                    <TableCell>{session.course}</TableCell>
                    <TableCell>{session.experience}</TableCell>
                    <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit session">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate(`/demosessions/edit/${session._id}`)}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete session">
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(session._id)}
                          >
                            Delete
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No UpskillLab sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this demo session? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => sessionToDelete && handleDelete(sessionToDelete)}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default DemoSessionsList;