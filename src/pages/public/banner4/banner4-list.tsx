// src/pages/banner4/banner4-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchBanner4s, updateBanner4Active, deleteBanner4 } from '../../../repo/banners.api';
import { Banner4 } from '../../../types'
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

const Banner4List = () => {
  const [banner4s, setBanner4s] = useState<Banner4[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getBanner4s = async () => {
      try {
        const data = await fetchBanner4s();
        setBanner4s(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load banner4s');
        setLoading(false);
      }
    };
    getBanner4s();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedBanner4 = await updateBanner4Active(id, !currentActive);
      setBanner4s(banner4s.map(b => b._id === id ? updatedBanner4 : b));
    } catch (err) {
      setError('Failed to update banner4 status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner4(id);
      setBanner4s(banner4s.filter(b => b._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete banner4');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Banner4 List
        </Typography>
        <MuiGrid container spacing={3}>
          {banner4s.map((banner4) => (
            <Grid item xs={12} sm={6} md={4} key={banner4._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{banner4.title}</Typography>
                  <img src={banner4.imageUrl} alt={banner4.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/banner4/edit/${banner4._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(banner4._id, banner4.active)}
                    color={banner4.active ? 'error' : 'success'}
                  >
                    {banner4.active ? 'No' : 'Yes'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(banner4._id)}
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
            Are you sure you want to delete the banner4 "{banner4s.find(b => b._id === deleteDialogOpen)?.title}"? This action cannot be undone.
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

export default Banner4List;