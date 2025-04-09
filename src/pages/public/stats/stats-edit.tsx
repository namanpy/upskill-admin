    // src/pages/stats/stats-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStats, updateStat,  } from '../../../repo/banners.api';
import { Stat } from '../../../types'

const StatsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stat, setStat] = useState<Stat | null>(null);
  const [formData, setFormData] = useState({
    count: '',
    label: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStat = async () => {
      const stats = await fetchStats();
      const foundStat = stats.find(stat => stat._id === id);
      if (foundStat) {
        setStat(foundStat);
        setFormData({
          count: foundStat.count,
          label: foundStat.label,
          active: foundStat.active,
        });
      }
    };
    loadStat();
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
    if (!stat) return;

    const data = new FormData();
    data.append('count', formData.count);
    data.append('label', formData.label);
    data.append('active', formData.active.toString());
    if (imageFile) data.append('image', imageFile);

    try {
      await updateStat(stat._id, data);
      navigate('/stats/list');
    } catch (err) {
      setError('Failed to update stat');
    }
  };

  if (!stat) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Stat
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="Count"
              name="count"
              value={formData.count}
              onChange={handleChange}
              required
            />
            <TextField
              label="Label"
              name="label"
              value={formData.label}
              onChange={handleChange}
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

export default StatsEdit;