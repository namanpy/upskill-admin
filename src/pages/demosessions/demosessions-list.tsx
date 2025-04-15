// src/pages/demosessions/demosessions-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { fetchDemoSessions,  deleteDemoSession } from '../../repo/banners.api';
import { DemoSession, }  from '../../types'
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv'; // npm install react-csv

const DemoSessionsList = () => {
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counselHubFilter, setCounselHubFilter] = useState('all');
  const [otherFilter, setOtherFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const getDemoSessions = async () => {
      try {
        const data = await fetchDemoSessions();
        setDemoSessions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load demo sessions');
        setLoading(false);
      }
    };
    getDemoSessions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDemoSession(id);
      setDemoSessions(demoSessions.filter(session => session._id !== id));
    } catch (err) {
      setError('Failed to delete demo session');
    }
  };

  // Filter function
  const filterByTime = (sessions: DemoSession[], filter: string) => {
    const now = new Date();
    switch (filter) {
      case 'month':
        return sessions.filter(session => new Date(session.createdAt) >= new Date(now.setMonth(now.getMonth() - 1)));
      case 'week':
        return sessions.filter(session => new Date(session.createdAt) >= new Date(now.setDate(now.getDate() - 7)));
      case 'day':
        return sessions.filter(session => new Date(session.createdAt) >= new Date(now.setDate(now.getDate() - 1)));
      default:
        return sessions;
    }
  };

  const counselHubSessions = filterByTime(demoSessions.filter(session => session.sourse === 'counselHub'), counselHubFilter);
  const otherSessions = filterByTime(demoSessions.filter(session => session.sourse !== 'counselHub'), otherFilter);

  if (loading) return <div>Loading...</div>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Demo Sessions
        </Typography>

        {/* CounselHub Table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            CounselHub Sessions
          </Typography>
          <FormControl sx={{ mb: 2 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={counselHubFilter}
              onChange={(e) => setCounselHubFilter(e.target.value as string)}
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="day">Last Day</MenuItem>
            </Select>
          </FormControl>
          <CSVLink data={counselHubSessions} filename="counselHub_sessions.csv">
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              Export to CSV
            </Button>
          </CSVLink>
          <Table>
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
              {counselHubSessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>{session.fullName}</TableCell>
                  <TableCell>{session.email}</TableCell>
                  <TableCell>{session.phoneNumber}</TableCell>
                  <TableCell>{session.course}</TableCell>
                  <TableCell>{session.experience}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => navigate(`/demosessions/edit/${session._id}`)}>Edit</Button>
                    <Button onClick={() => handleDelete(session._id)} color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* UpskillLab Table */}
        <Box>
          <Typography variant="h5" gutterBottom>
            UpskillLab Sessions
          </Typography>
          <FormControl sx={{ mb: 2 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={otherFilter}
              onChange={(e) => setOtherFilter(e.target.value as string)}
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="day">Last Day</MenuItem>
            </Select>
          </FormControl>
          <CSVLink data={otherSessions} filename="upskilllab_sessions.csv">
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              Export to CSV
            </Button>
          </CSVLink>
          <Table>
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
              {otherSessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>{session.fullName}</TableCell>
                  <TableCell>{session.email}</TableCell>
                  <TableCell>{session.phoneNumber}</TableCell>
                  <TableCell>{session.course}</TableCell>
                  <TableCell>{session.experience}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => navigate(`/demosessions/edit/${session._id}`)}>Edit</Button>
                    <Button onClick={() => handleDelete(session._id)} color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default DemoSessionsList;