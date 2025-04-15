// src/pages/premium-learning-experiences/premium-learning-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPremiumLearningExperiences, updatePremiumLearningExperience } from '../../../repo/banners.api';
import { PremiumLearningExperience } from '../../../types';

const PremiumLearningEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<PremiumLearningExperience | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
  });

  useEffect(() => {
    const loadExperience = async () => {
      const experiences = await fetchPremiumLearningExperiences();
      const foundExperience = experiences.find(exp => exp._id === id);
      if (foundExperience) {
        setExperience(foundExperience);
        setFormData({
          title: foundExperience.title,
          active: foundExperience.active,
        });
      }
    };
    loadExperience();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Real-time validation
    let titleError = '';

    if (name === 'title') {
      titleError = validateWords(value, 6, 'Title');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setValidationErrors({
      title: titleError,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience) return;

    // Validate before submission
    const titleError = validateWords(formData.title, 6, 'Title');

    if (titleError) {
      setValidationErrors({
        title: titleError,
      });
      return; // Stop submission if validation fails
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('active', formData.active.toString());
    if (imageFile) data.append('image', imageFile);

    try {
      await updatePremiumLearningExperience(experience._id, data);
      navigate('/banner2/list');
    } catch (err) {
      setError('Failed to update premium learning experience');
    }
  };

  // Validation function to count words
  const validateWords = (text: string, maxWords: number, fieldName: string): string => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > maxWords ? `${fieldName} cannot exceed ${maxWords} words.` : '';
  };

  if (!experience) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Premium Learning Experience
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              error={!!validationErrors.title}
              helperText={validationErrors.title || 'Max 6 words'}
            />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Image
              </Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                />
              }
              label="Active"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!!validationErrors.title}
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PremiumLearningEdit;