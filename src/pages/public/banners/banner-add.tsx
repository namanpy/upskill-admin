// src/pages/banners/banner-add.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createBanner } from '../../../repo/banners.api';

const BannerAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  const createBannerMutation = useMutation({
    mutationFn: async () => {
      // Validate before submission
      const titleError = validateWords(formData.title, 6, 'Title');
      const subtitleError = validateWords(formData.subtitle, 10, 'Subtitle');
      const descriptionError = validateWords(formData.description, 20, 'Description');

      if (titleError || subtitleError || descriptionError) {
        setValidationErrors({
          title: titleError || '',
          subtitle: subtitleError || '',
          description: descriptionError || '',
        });
        throw new Error('Please fix the validation errors.');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('description', formData.description);
      data.append('active', formData.active.toString());
      if (imageFile) data.append('image', imageFile);

      return createBanner(data);
    },
    onSuccess: () => {
      navigate('/banners/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create banner');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Real-time validation
    let titleError = '';
    let subtitleError = '';
    let descriptionError = '';

    if (name === 'title') {
      titleError = validateWords(value, 6, 'Title');
    } else if (name === 'subtitle') {
      subtitleError = validateWords(value, 10, 'Subtitle');
    } else if (name === 'description') {
      descriptionError = validateWords(value, 20, 'Description');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setValidationErrors({
      title: titleError,
      subtitle: subtitleError,
      description: descriptionError,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBannerMutation.mutate();
  };

  // Validation function to count words
  const validateWords = (text: string, maxWords: number, fieldName: string): string => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > maxWords ? `${fieldName} cannot exceed ${maxWords} words.` : '';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add New Banner
        </Typography>

        {(createBannerMutation.isError && error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
            <TextField
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
              error={!!validationErrors.subtitle}
              helperText={validationErrors.subtitle || 'Max 10 words'}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              error={!!validationErrors.description}
              helperText={validationErrors.description || 'Max 20 words'}
            />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Banner Image
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
                disabled={createBannerMutation.isPending || !!validationErrors.title || !!validationErrors.subtitle || !!validationErrors.description}
              >
                {createBannerMutation.isPending ? 'Creating...' : 'Create Banner'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BannerAdd;