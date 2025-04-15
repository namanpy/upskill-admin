// src/pages/universities/universities-list.tsx
import React, { useEffect, useState } from 'react';
// import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchUniversities, updateUniversityCertification, deleteUniversity } from '../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import { University }  from '../../types'
// const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

// src/pages/universities/universities-list.tsx
// import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import { fetchUniversities, University, updateUniversityCertification, deleteUniversity } from '../../repo/api';
// import { useNavigate } from 'react-router-dom';

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const UniversitiesList = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUniversities = async () => {
      try {
        const data = await fetchUniversities();
        console.log('Fetched universities:', data); // Debug log
        setUniversities(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load universities');
        setLoading(false);
      }
    };
    getUniversities();
  }, []);

  const handleToggleCertification = async (id: string, currentCertification: boolean) => {
    try {
      const updatedUniversity = await updateUniversityCertification(id, !currentCertification);
      setUniversities(universities.map(u => u._id === id ? updatedUniversity : u));
    } catch (err) {
      setError('Failed to update university certification status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUniversity(id);
      setUniversities(universities.filter(u => u._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete university');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Universities List
        </Typography>
        <MuiGrid container spacing={3}>
          {universities.length > 0 ? (
            universities.map((university) => (
              <Grid item xs={12} sm={6} md={4} key={university._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{university.institutionType}</Typography>
                    <Typography variant="body2">Delivery: {university.deliveryMode} | Programs: {university.programs.length > 0 ? university.programs.join(', ') : 'N/A'}</Typography>
                    <Typography variant="caption">Rating: {university.rating} | Reviews: {university.reviews}</Typography>
                    <img src={university.imageUrl} alt={university.institutionType} style={{ maxWidth: '100%', marginTop: '10px' }} />
                    {university.fitCropUrl && <img src={university.fitCropUrl} alt={`${university.institutionType} cropped`} style={{ maxWidth: '100%', marginTop: '10px' }} />}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/universities/edit/${university._id}`)}>Edit</Button>
                    <Button
                      size="small"
                      onClick={() => handleToggleCertification(university._id, university.certification)}
                      color={university.certification ? 'error' : 'success'}
                    >
                      {university.certification ? 'Uncertify' : 'Certify'}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialogOpen(university._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No universities found.</Typography>
          )}
        </MuiGrid>
      </Paper>
      <Dialog
        open={!!deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the university "{universities.find(u => u._id === deleteDialogOpen)?.institutionType}"? This action cannot be undone.
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

export default UniversitiesList;