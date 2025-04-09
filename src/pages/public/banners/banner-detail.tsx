// src/pages/banners/banner-detail.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';
import { Banner } from '../../../types';

interface BannerDetailProps {
  banner: Banner;
  onClose: () => void;
}

const BannerDetail: React.FC<BannerDetailProps> = ({ banner, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{banner.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Subtitle: {banner.subtitle}</Typography>
        <Typography variant="body1">Description: {banner.description}</Typography>
        <Typography variant="body2">Created: {new Date(banner.createdAt).toLocaleDateString()}</Typography>
        <Typography variant="body2">Updated: {new Date(banner.updatedAt).toLocaleDateString()}</Typography>
        <img src={banner.imageUrl} alt={banner.title} style={{ maxWidth: '100%', marginTop: '10px' }} />
        <Typography variant="body2">Active: {banner.active ? 'Yes' : 'No'}</Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BannerDetail;