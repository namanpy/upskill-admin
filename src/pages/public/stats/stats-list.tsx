// src/pages/stats/stats-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchStats,  updateStatActive, deleteStat } from '../../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import { Stat } from '../../../types'


const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const StatsList = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stats');
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedStat = await updateStatActive(id, !currentActive);
      setStats(stats.map(stat => stat._id === id ? updatedStat : stat));
    } catch (err) {
      setError('Failed to update stat status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStat(id);
      setStats(stats.filter(stat => stat._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete stat');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Stats
        </Typography>
        <MuiGrid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{stat.label}</Typography>
                  <Typography variant="body1">Count: {stat.count}</Typography>
                  <img src={stat.imageUrl} alt={stat.label} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/stats/edit/${stat._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(stat._id, stat.active)}
                    color={stat.active ? 'error' : 'success'}
                  >
                    {stat.active ? 'No' : 'Yes'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(stat._id)}
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
            Are you sure you want to delete the stat "{stats.find(stat => stat._id === deleteDialogOpen)?.label}"? This action cannot be undone.
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

export default StatsList;