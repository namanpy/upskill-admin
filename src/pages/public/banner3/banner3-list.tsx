// src/pages/banner3/banner3-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchBanner3s, updateBanner3Active, deleteBanner3 } from '../../../repo/banners.api';
import { Banner3 } from '../../../types';
import { useNavigate } from 'react-router-dom';

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const Banner3List = () => {
  const [banner3s, setBanner3s] = useState<Banner3[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getBanner3s = async () => {
      try {
        const data = await fetchBanner3s();
        setBanner3s(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load banner3s');
        setLoading(false);
      }
    };
    getBanner3s();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedBanner3 = await updateBanner3Active(id, !currentActive);
      setBanner3s(banner3s.map(b => b._id === id ? updatedBanner3 : b));
    } catch (err) {
      setError('Failed to update banner3 status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner3(id);
      setBanner3s(banner3s.filter(b => b._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete banner3');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Banner3 List
        </Typography>
        <MuiGrid container spacing={3}>
          {banner3s.map((banner3) => (
            <Grid item xs={12} sm={6} md={4} key={banner3._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{banner3.title}</Typography>
                  <img src={banner3.imageUrl} alt={banner3.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/banner3/edit/${banner3._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(banner3._id, banner3.active)}
                    color={banner3.active ? 'error' : 'success'}
                  >
                    {banner3.active ? 'No' : 'Yes'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(banner3._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </MuiGrid>
      </Paper>
      <Dialog
        open={!!deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the banner3 "{banner3s.find(b => b._id === deleteDialogOpen)?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(null)}>Cancel</Button>
          <Button
            onClick={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Banner3List;