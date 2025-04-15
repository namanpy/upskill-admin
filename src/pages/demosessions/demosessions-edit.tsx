// src/pages/demosessions/demosessions-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDemoSessions, updateDemoSession } from '../../repo/banners.api';

const DemoSessionsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    course: '',
    experience: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const sessions = await fetchDemoSessions();
      const session = sessions.find(s => s._id === id);
      if (session) {
        setFormData({
          fullName: session.fullName,
          email: session.email,
          phoneNumber: session.phoneNumber,
          course: session.course,
          experience: session.experience,
        });
      }
    };
    loadSession();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('course', formData.course);
    data.append('experience', formData.experience);
    // sourse exclude kiya

    try {
      await updateDemoSession(id!, data);
      navigate('/demosessions/list');
    } catch (err) {
      setError('Failed to update demo session');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Demo Session
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
            <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            <TextField label="Course" name="course" value={formData.course} onChange={handleChange} required />
            <TextField label="Experience" name="experience" value={formData.experience} onChange={handleChange} required />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" size="large">
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DemoSessionsEdit;