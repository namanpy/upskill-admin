// src/pages/hiring-partners/hiring-partners-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchHiringPartners, updateHiringPartner,  } from '../../../repo/banners.api';
import { HiringPartner } from '../../../types'

const HiringPartnersEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<HiringPartner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPartner = async () => {
      const partners = await fetchHiringPartners();
      const foundPartner = partners.find(p => p._id === id);
      if (foundPartner) {
        setPartner(foundPartner);
        setFormData({
          name: foundPartner.name,
          active: foundPartner.active,
        });
      }
    };
    loadPartner();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('active', formData.active.toString());
    if (logoFile) data.append('logo', logoFile);

    try {
      await updateHiringPartner(partner._id, data);
      navigate('/hiring-partners/list');
    } catch (err) {
      setError('Failed to update hiring partner');
    }
  };

  if (!partner) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Hiring Partner
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Logo
              </Typography>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
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

export default HiringPartnersEdit;