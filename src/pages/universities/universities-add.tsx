// src/pages/universities/universities-add.tsx
import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createUniversity } from '../../repo/banners.api';

const UniversitiesAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    institutionType: '',
    deliveryMode: '',
    programType: '',
    ratings: '',
    reviews: '',
    certification: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append('institutionType', formData.institutionType);
      data.append('deliveryMode', formData.deliveryMode);
      // Split the comma-separated string and trim whitespace, then join as JSON array
      const programTypeArray = formData.programType.split(',').map(item => item.trim());
      data.append('programType', JSON.stringify(programTypeArray)); // Send as JSON array
      data.append('ratings', formData.ratings);
      data.append('reviews', formData.reviews);
      data.append('certification', formData.certification.toString());
      if (imageFile) data.append('image', imageFile);

      return createUniversity(data);
    },
    onSuccess: () => {
      navigate('/universities/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create university');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add University
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField label="Institution Type" name="institutionType" value={formData.institutionType} onChange={handleChange} required />
            <TextField label="Delivery Mode" name="deliveryMode" value={formData.deliveryMode} onChange={handleChange} required />
            <TextField label="Program Type (e.g., UG Programs, MBA, M.Sc.)" name="programType" value={formData.programType} onChange={handleChange} required />
            <TextField label="Ratings" name="ratings" value={formData.ratings} onChange={handleChange} type="number" required />
            <TextField label="Reviews" name="reviews" value={formData.reviews} onChange={handleChange} type="number" required />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Image
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Box>
            <FormControlLabel
              control={<Switch checked={formData.certification} onChange={handleChange} name="certification" />}
              label="Certification"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={createMutation.isPending}
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

export default UniversitiesAdd;