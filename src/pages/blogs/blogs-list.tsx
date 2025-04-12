// src/pages/blogs/blogs-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchBlogs,  updateBlogApproval, deleteBlog } from '../../repo/banners.api';
import { Blog } from '../../types'
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

const BlogsList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blogs');
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleToggleApproval = async (id: string, currentApproval: boolean) => {
    try {
      const updatedBlog = await updateBlogApproval(id, !currentApproval);
      setBlogs(blogs.map(b => b._id === id ? updatedBlog : b));
    } catch (err) {
      setError('Failed to update blog approval status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(b => b._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Blogs List
        </Typography>
        <MuiGrid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{blog.title}</Typography>
                  <Typography variant="body2">{blog.description.substring(0, 100)}{blog.description.length > 100 ? '...' : ''}</Typography>
                  <Typography variant="caption">Tag: {blog.tag} | Student: {blog.studentName || blog.studentId}</Typography>
                  <img src={blog.image} alt={blog.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/blogs/edit/${blog._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleApproval(blog._id, blog.approvedByAdmin)}
                    color={blog.approvedByAdmin ? 'error' : 'success'}
                  >
                    {blog.approvedByAdmin ? 'Unapprove' : 'Approve'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(blog._id)}
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
            Are you sure you want to delete the blog "{blogs.find(b => b._id === deleteDialogOpen)?.title}"? This action cannot be undone.
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

export default BlogsList;