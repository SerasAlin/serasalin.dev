'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { primaryNav, utilityNav } from '@/content/navigation';
import { NavLinks } from './nav-links';
import { socialLinks } from '@/content/social';
import styles from './mobile-nav-toggle.module.css';

export const MobileNavToggle = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        className={styles.trigger}
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        size="small"
        color="inherit"
      >
        <MenuIcon fontSize="small" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className={styles.panel} role="dialog" aria-label="Navigation">
          <div className={styles.header}>
            <Typography variant="overline" color="text.secondary">
              Menu
            </Typography>
            <IconButton aria-label="Close navigation" onClick={() => setOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className={styles.section}>
            <NavLinks items={primaryNav} orientation="column" onNavigate={() => setOpen(false)} />
          </div>
          <Divider />
          <div className={styles.section}>
            <NavLinks items={utilityNav} orientation="column" onNavigate={() => setOpen(false)} />
          </div>
          <Divider />
          <div className={styles.footer}>
            {socialLinks.map((l) => (
              <a key={l.id} href={l.href} className={styles.socialLink}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};
