// src/pages/hiring-partners/hiring-partners-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchHiringPartners, updateHiringPartnerActive, deleteHiringPartner } from '../../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import { HiringPartner } from '../../../types'

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const HiringPartnersList = () => {
  const [hiringPartners, setHiringPartners] = useState<HiringPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getHiringPartners = async () => {
      try {
        const data = await fetchHiringPartners();
        setHiringPartners(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load hiring partners');
        setLoading(false);
      }
    };
    getHiringPartners();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedPartner = await updateHiringPartnerActive(id, !currentActive);
      setHiringPartners(hiringPartners.map(p => p._id === id ? updatedPartner : p));
    } catch (err) {
      setError('Failed to update hiring partner status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHiringPartner(id);
      setHiringPartners(hiringPartners.filter(p => p._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete hiring partner');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Hiring Partners List
        </Typography>
        <MuiGrid container spacing={3}>
          {hiringPartners.map((partner) => (
            <Grid item xs={12} sm={6} md={4} key={partner._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{partner.name}</Typography>
                  <img src={partner.logo} alt={partner.name} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/hiring-partners/edit/${partner._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(partner._id, partner.active)}
                    color={partner.active ? 'error' : 'success'}
                  >
                    {partner.active ? 'No' : 'Yes'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(partner._id)}
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
            Are you sure you want to delete the hiring partner "{hiringPartners.find(p => p._id === deleteDialogOpen)?.name}"? This action cannot be undone.
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

export default HiringPartnersList;