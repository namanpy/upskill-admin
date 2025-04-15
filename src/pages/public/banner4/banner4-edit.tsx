// src/pages/banner4/banner4-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBanner4s, updateBanner4 } from '../../../repo/banners.api';
import { Banner4 } from '../../../types';

const Banner4Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner4, setBanner4] = useState<Banner4 | null>(null);
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

  useEffect(() => {
    const loadBanner4 = async () => {
      const banner4s = await fetchBanner4s();
      const foundBanner4 = banner4s.find(b => b._id === id);
      if (foundBanner4) {
        setBanner4(foundBanner4);
        setFormData({
          title: foundBanner4.title,
          descriptions: foundBanner4.descriptions || '', // Default to empty string if undefined
          active: foundBanner4.active,
        });
      }
    };
    loadBanner4();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner4) return;

    // Validate before submission
    const titleError = validateWords(formData.title, 6, 'Title');
    const descriptionsError = validateWords(formData.descriptions, 20, 'Descriptions');

    if (titleError || descriptionsError) {
      setValidationErrors({
        title: titleError,
        descriptions: descriptionsError,
      });
      return; // Stop submission if validation fails
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('descriptions', formData.descriptions);
    data.append('active', formData.active.toString());
    if (imageFile) data.append('image', imageFile);

    try {
      await updateBanner4(banner4._id, data);
      navigate('/banner4/list');
    } catch (err) {
      setError('Failed to update banner4');
    }
  };

  // Validation function to count words
  const validateWords = (text: string, maxWords: number, fieldName: string): string => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > maxWords ? `${fieldName} cannot exceed ${maxWords} words.` : '';
  };

  if (!banner4) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Banner4
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
                disabled={!!validationErrors.title || !!validationErrors.descriptions}
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

export default Banner4Edit;