// src/pages/banners/banner-list.tsx
// import React, { useEffect, useState } from 'react';
// import { Container, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
// import { fetchBanners } from '../../repo/banners.api';
import { Banner } from '../../../types';

// src/pages/banners/banner-list.tsx
import React, { useEffect, useState } from 'react';
// import { Container, Paper, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { fetchBanners,  updateBannerActive, deleteBanner } from '../../../repo/banners.api';
import { useNavigate } from 'react-router-dom';
import BannerDetail from './banner-detail'; // New component


// src/pages/banners/banner-list.tsx
// import React, { useEffect, useState } from 'react';
// import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { Container, Paper, Typography, Grid as MuiGrid, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import { fetchBanners, Banner, updateBannerActive } from '../../repo/api';
// import { useNavigate } from 'react-router-dom';
// import BannerDetail from './banner-detail';

// Explicitly type the Grid props to avoid TS errors
const Grid = MuiGrid as React.ComponentType<MuiGridProps>;

interface MuiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  key?: string;
  children?: React.ReactNode;
}

const BannerList = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null); // ID of banner to delete
  const navigate = useNavigate();

  useEffect(() => {
    const getBanners = async () => {
      try {
        const data = await fetchBanners();
        setBanners(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load banners');
        setLoading(false);
      }
    };
    getBanners();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updatedBanner = await updateBannerActive(id, !currentActive);
      setBanners(banners.map(banner => banner._id === id ? updatedBanner : banner));
    } catch (err) {
      setError('Failed to update banner status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      setBanners(banners.filter(banner => banner._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Banner List
        </Typography>
        <MuiGrid container spacing={3}>
          {banners.map((banner) => (
            <Grid item xs={12} sm={6} md={4} key={banner._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{banner.title}</Typography>
                  <Typography variant="subtitle1">{banner.subtitle}</Typography>
                  <Typography variant="body2">{banner.description.substring(0, 100)}{banner.description.length > 100 ? '...' : ''}</Typography>
                  <img src={banner.imageUrl} alt={banner.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/banners/edit/${banner._id}`)}>Edit</Button>
                  <Button
                    size="small"
                    onClick={() => handleToggleActive(banner._id, banner.active)}
                    color={banner.active ? 'error' : 'success'}
                  >
                    {banner.active ? 'No' : 'Yes'}
                  </Button>
                  <Button size="small" onClick={() => setSelectedBanner(banner)}>Read More</Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(banner._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </MuiGrid>
      </Paper>
      {selectedBanner && <BannerDetail banner={selectedBanner} onClose={() => setSelectedBanner(null)} />}
      <Dialog
        open={!!deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the banner "{banners.find(b => b._id === deleteDialogOpen)?.title}"? This action cannot be undone.
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

export default BannerList;

// const BannerList = () => {
//     const [banners, setBanners] = useState<Banner[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
  
//     useEffect(() => {
//       const getBanners = async () => {
//         try {
//           const data = await fetchBanners();
//           setBanners(data); // Now 'data' is directly the 'banners' array
//           setLoading(false);
//         } catch (err) {
//           setError('Failed to load banners');
//           setLoading(false);
//         }
//       };
//       getBanners();
//     }, []);
  
//     if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
//     if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;
  
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <Paper sx={{ p: 4, borderRadius: 2 }}>
//           <Typography variant="h4" gutterBottom>
//             Banner List
//           </Typography>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell>Subtitle</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Image URL</TableCell>
//                 <TableCell>Active</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {banners.map((banner) => (
//                 <TableRow key={banner._id}>
//                   <TableCell>{banner.title}</TableCell>
//                   <TableCell>{banner.subtitle}</TableCell>
//                   <TableCell>{banner.description}</TableCell>
//                   <TableCell><a href={banner.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></TableCell>
//                   <TableCell>{banner.active ? 'Yes' : 'No'}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>
//       </Container>
//     );
//   };
  
// //   export default BannerList;

// export default BannerList;