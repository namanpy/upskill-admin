// src/pages/banners/banner-list.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { fetchBanners } from '../../repo/banners.api';
import { Banner } from '../../common';


const BannerList = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const getBanners = async () => {
        try {
          const data = await fetchBanners();
          setBanners(data); // Now 'data' is directly the 'banners' array
          setLoading(false);
        } catch (err) {
          setError('Failed to load banners');
          setLoading(false);
        }
      };
      getBanners();
    }, []);
  
    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
    if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;
  
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Banner List
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subtitle</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image URL</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>{banner.subtitle}</TableCell>
                  <TableCell>{banner.description}</TableCell>
                  <TableCell><a href={banner.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></TableCell>
                  <TableCell>{banner.active ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    );
  };
  
//   export default BannerList;

export default BannerList;