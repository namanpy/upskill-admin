// src/pages/blogs/blogs-add.tsx
import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../repo/banners.api';

const BlogsAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    studentId: '',
    approvedByAdmin: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('tag', formData.tag);
      data.append('studentId', formData.studentId);
      data.append('approvedByAdmin', formData.approvedByAdmin.toString());
      if (imageFile) data.append('image', imageFile);

      return createBlog(data);
    },
    onSuccess: () => {
      navigate('/blogs/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create blog');
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
          Add Blog
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} required />
            <TextField label="Tag" name="tag" value={formData.tag} onChange={handleChange} required />
            <TextField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Image
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Box>
            <FormControlLabel
              control={<Switch checked={formData.approvedByAdmin} onChange={handleChange} name="approvedByAdmin" />}
              label="Approved by Admin"
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

export default BlogsAdd;