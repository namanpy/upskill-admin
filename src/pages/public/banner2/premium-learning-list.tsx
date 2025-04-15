// src/pages/premium-learning-experiences/premium-learning-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchPremiumLearningExperiences, updatePremiumLearningActive, deletePremiumLearningExperience } from '../../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import { PremiumLearningExperience } from '../../../types';

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const PremiumLearningList = () => {
  const [premiumLearning, setPremiumLearning] = useState<PremiumLearningExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPremiumLearning = async () => {
      try {
        const data = await fetchPremiumLearningExperiences();
        setPremiumLearning(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load premium learning experiences');
        setLoading(false);
      }
    };
    getPremiumLearning();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedExperience = await updatePremiumLearningActive(id, !currentActive);
      setPremiumLearning(premiumLearning.map(exp => exp._id === id ? updatedExperience : exp));
    } catch (err) {
      setError('Failed to update premium learning status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePremiumLearningExperience(id);
      setPremiumLearning(premiumLearning.filter(exp => exp._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete premium learning experience');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Premium Learning Experiences
        </Typography>
        <MuiGrid container spacing={3}>
          {premiumLearning.map((exp) => (
            <Grid item xs={12} sm={6} md={4} key={exp._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{exp.title}</Typography>
                  <img src={exp.imageUrl} alt={exp.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/banner2/edit/${exp._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(exp._id, exp.active)}
                    color={exp.active ? 'error' : 'success'}
                  >
                    {exp.active ? 'No' : 'Yes'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(exp._id)}
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
            Are you sure you want to delete the experience "{premiumLearning.find(exp => exp._id === deleteDialogOpen)?.title}"? This action cannot be undone.
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

export default PremiumLearningList;