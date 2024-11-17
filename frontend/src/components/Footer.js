import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Email, Phone, Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        bottom: 0,
        position: 'relative',
        backgroundColor: '#191331',
        width: '100%',
        padding: 'clamp(10px, 2vw, 20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
      }}
    >
      {/* Top Section: Contact and Social Media */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          mb: 'clamp(10px, 2vw, 20px)',
        }}
      >
        {/* Contact Information */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" fontSize="clamp(12px, 1vw, 16px)">
            <Email sx={{ marginRight: '5px', verticalAlign: 'middle' }} /> info@whatthefuncinema.com
          </Typography>
          <Typography variant="body2" fontSize="clamp(12px, 1vw, 16px)">
            <Phone sx={{ marginRight: '5px', verticalAlign: 'middle' }} /> (+598) 123 456 7890
          </Typography>
        </Box>

        {/* Social Media Links */}
        <Box sx={{ display: 'flex', gap: '10px',mb:'-10px',mt:'10px' }}>
          <IconButton
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#ffffff', '&:hover': { color: '#4267B2' } }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            component="a"
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#ffffff', '&:hover': { color: '#1DA1F2' } }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            component="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#ffffff', '&:hover': { color: '#C13584' } }}
          >
            <Instagram />
          </IconButton>
        </Box>
      </Box>

      {/* Bottom Section: Copyright */}
      <Typography
        variant="body2"
        fontSize="clamp(10px, 0.8vw, 12px)"
        sx={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: 'clamp(5px, 1vw, 10px)', width: '100%' }}
      >
        © 2024 What The Fun Cinema | All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
