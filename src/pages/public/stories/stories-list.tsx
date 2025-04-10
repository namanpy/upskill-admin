// src/pages/stories/stories-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchStories, updateStoryWallOfFame, deleteStory } from '../../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../../types'

const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const StoriesList = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStories = async () => {
      try {
        const data = await fetchStories();
        setStories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stories');
        setLoading(false);
      }
    };
    getStories();
  }, []);

  const handleToggleWallOfFame = async (id: string, currentWallOfFame: boolean) => {
    try {
      const updatedStory = await updateStoryWallOfFame(id, !currentWallOfFame);
      setStories(stories.map(s => s._id === id ? updatedStory : s));
    } catch (err) {
      setError('Failed to update story wall of fame status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStory(id);
      setStories(stories.filter(s => s._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Stories List
        </Typography>
        <MuiGrid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{story.name} - {story.jobTitle}</Typography>
                  <Typography variant="body2">{story.description.substring(0, 100)}{story.description.length > 100 ? '...' : ''}</Typography>
                  <img src={story.userImageUrl} alt={story.name} style={{ maxWidth: '100%', marginTop: '10px' }} />
                  <img src={story.companyLogoUrl} alt={story.companyName} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/stories/edit/${story._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleWallOfFame(story._id, story.wallOfFame)}
                    color={story.wallOfFame ? 'error' : 'success'}
                  >
                    {story.wallOfFame ? 'Remove from Wall' : 'Add to Wall'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(story._id)}
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
            Are you sure you want to delete the story for "{stories.find(s => s._id === deleteDialogOpen)?.name}"? This action cannot be undone.
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

export default StoriesList;