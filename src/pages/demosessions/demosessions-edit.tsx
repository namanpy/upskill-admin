import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
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
    sourse: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessions = await fetchDemoSessions();
        const session = sessions.find(s => s._id === id);
        console.log(session)
        if (session) {
          setFormData({
            fullName: session.fullName,
            email: session.email,
            phoneNumber: session.phoneNumber,
            course: session.course,
            experience: session.experience || '',
            sourse: session.sourse || '',
          });
        }
      } catch (err) {
        setError('Failed to load demo session');
      }
    };
    loadSession();
  }, [id]);

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
      sourse: formData.sourse,
    };

    if (formData.sourse !== 'counselHub') {
      data.experience = formData.experience;
    }

    try {
      const res = await updateDemoSession(id!, data);
      setLoading(false);
      navigate('/demosessions/list');
    } catch (err) {
      setError('Failed to update demo session');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600}}>
            Edit Demo Session
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
            <TextField
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
            {formData.sourse !== 'counselHub' && (
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3f51b5',
                    },
                  },
                }}
              />
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Tooltip title="Update the demo session">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    borderRadius: 2,
                    padding: '12px 24px',
                    backgroundColor: '#3f51b5',
                    '&:hover': {
                      backgroundColor: '#303f9f',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Update
                </Button>
              </Tooltip>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  padding: '12px 24px',
                  borderColor: '#3f51b5',
                  color: '#3f51b5',
                  '&:hover': {
                    backgroundColor: '#f5f6fa',
                    borderColor: '#303f9f',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DemoSessionsEdit;