// src/pages/demosessions/demosessions-add.tsx
import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createDemoSession } from '../../repo/banners.api';

const DemoSessionsAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    course: '',
    experience: 'Fresher',
  });
  const [error, setError] = useState<string | null>(null);

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
      await createDemoSession(data);
      navigate('/demosessions/list');
    } catch (err) {
      setError('Failed to create demo session');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add Demo Session
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
                Create
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DemoSessionsAdd;