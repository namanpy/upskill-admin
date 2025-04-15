// src/pages/banner4/banner4-add.tsx
import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createBanner4 } from '../../../repo/banners.api';

const Banner4Add = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    descriptions: '',
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      // Validate before submission
      const titleError = validateWords(formData.title, 6, 'Title');
      const descriptionsError = validateWords(formData.descriptions, 20, 'Descriptions');

      if (titleError || descriptionsError) {
        setValidationErrors({
          title: titleError,
          descriptions: descriptionsError,
        });
        throw new Error('Please fix the validation errors.');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('descriptions', formData.descriptions);
      data.append('active', formData.active.toString());
      if (imageFile) data.append('image', imageFile);

      return createBanner4(data);
    },
    onSuccess: () => {
      navigate('/banner4/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create banner4');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Real-time validation
    let titleError = '';
    let descriptionsError = '';

    if (name === 'title') {
      titleError = validateWords(value, 6, 'Title');
    } else if (name === 'descriptions') {
      descriptionsError = validateWords(value, 20, 'Descriptions');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setValidationErrors({
      title: titleError,
      descriptions: descriptionsError,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
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
          Add Banner4
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
            <TextField
              label="Descriptions"
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
              multiline
              rows={4}
              required
              error={!!validationErrors.descriptions}
              helperText={validationErrors.descriptions || 'Max 20 words'}
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
                disabled={createMutation.isPending || !!validationErrors.title || !!validationErrors.descriptions}
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Banner4Add;