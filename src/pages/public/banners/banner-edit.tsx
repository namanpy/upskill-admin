// src/pages/banners/banner-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBanners, updateBanner } from '../../../repo/banners.api';
import { Banner } from '../../../types';

const BannerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);
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

  useEffect(() => {
    const loadBanner = async () => {
      const banners = await fetchBanners();
      const foundBanner = banners.find(b => b._id === id);
      if (foundBanner) {
        setBanner(foundBanner);
        setFormData({
          title: foundBanner.title,
          subtitle: foundBanner.subtitle,
          description: foundBanner.description,
          active: foundBanner.active,
        });
      }
    };
    loadBanner();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;

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
      return; // Stop submission if validation fails
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('description', formData.description);
    data.append('active', formData.active.toString());
    if (imageFile) data.append('image', imageFile);

    try {
      await updateBanner(banner._id, data);
      navigate('/banners/list');
    } catch (err) {
      setError('Failed to update banner');
    }
  };

  // Validation function to count words
  const validateWords = (text: string, maxWords: number, fieldName: string): string => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > maxWords ? `${fieldName} cannot exceed ${maxWords} words.` : '';
  };

  if (!banner) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Banner
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
                disabled={!!validationErrors.title || !!validationErrors.subtitle || !!validationErrors.description}
              >
                Update Banner
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BannerEdit;