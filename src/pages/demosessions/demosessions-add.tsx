import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createDemoSession } from '../../repo/banners.api';

const DemoSessionsAdd = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<'upskillLab' | 'counselHub'>('upskillLab');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    course: '',
    experience: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data: any = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      course: formData.course,
      sourse: formType, // Corrected from 'sourse'
    };

    if (formType === 'upskillLab') {
      data.experience = formData.experience;
    }

    try {
      await createDemoSession(data);
      // navigate('/demosessions/list');
      setLoading(false)
    } catch (err) {
      setError(`Failed to create ${formType} session`);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      course: '',
      experience: 'Fresher',
    });
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="flex-end" mt={2} mb={2}>
  <Tooltip title="View all demo sessions">
    <Button
      variant="outlined"
      color="primary"
      size="large"
      onClick={() => navigate('/demosessions/list')}
      disabled={loading}
    >
      View Sessions
    </Button>
  </Tooltip>
</Box>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add Demo Session
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Tooltip title="Switch to UpskillLab form">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormType('upskillLab');
                resetForm();
              }}
              disabled={formType === 'upskillLab'}
            >
              UpskillLab Form
            </Button>
          </Tooltip>
          <Tooltip title="Switch to CounselHub form">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormType('counselHub');
                resetForm();
              }}
              disabled={formType === 'counselHub'}
            >
              CounselHub Form
            </Button>
          </Tooltip>
        </Box>

        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <TextField
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
              {formType === 'upskillLab' && (
                <TextField
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Tooltip title={`Create a ${formType} session`}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    Create Session
                  </Button>
                </Tooltip>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/demosessions/list')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </>
      </Paper>
    </Container>
  );
};

export default DemoSessionsAdd;