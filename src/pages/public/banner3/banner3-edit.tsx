// src/pages/banner3/banner3-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBanner3s, updateBanner3,  } from '../../../repo/banners.api';
import { Banner3 } from '../../../types'

const Banner3Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner3, setBanner3] = useState<Banner3 | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBanner3 = async () => {
      const banner3s = await fetchBanner3s();
      const foundBanner3 = banner3s.find(b => b._id === id);
      if (foundBanner3) {
        setBanner3(foundBanner3);
        setFormData({
          title: foundBanner3.title,
          descriptions: foundBanner3.descriptions,
          active: foundBanner3.active,
        });
      }
    };
    loadBanner3();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner3) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('descriptions', formData.descriptions);
    data.append('active', formData.active.toString());
    if (imageFile) data.append('image', imageFile);

    try {
      await updateBanner3(banner3._id, data);
      navigate('/banner3/list');
    } catch (err) {
      setError('Failed to update banner3');
    }
  };

  if (!banner3) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Banner3
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
            />
            <TextField
              label="Descriptions"
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
              multiline
              rows={4}
              required
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

export default Banner3Edit;