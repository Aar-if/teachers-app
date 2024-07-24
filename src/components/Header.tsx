'use client';

import { Box, Stack } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import React, { useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';

import ConfirmationModal from './ConfirmationModal';
import Image from 'next/image';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import accountIcon from './../assets/images/account.svg';
import dynamic from 'next/dynamic';
import { logEvent } from '@/utils/googleAnalytics';
import logoLight from '../../public/images/logo-light.png';
import menuIcon from '../assets/images/menuIcon.svg';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const theme = useTheme<any>();
  const userId = localStorage.getItem('userId');

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(() => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const handleProfileClick = () => {
    if (pathname !== `/user-profile/${userId}`) {
      router.push(`/user-profile/${userId}`);
      logEvent({
        action: 'my-profile-clicked-header',
        category: 'Dashboard',
        label: 'Profile Clicked',
      });
    }
  };
  const handleLogoutClick = () => {
    router.replace('/logout');
    logEvent({
      action: 'logout-clicked-header',
      category: 'Dashboard',
      label: 'Logout Clicked',
    });
  };
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };
  const MenuDrawer = dynamic(() => import('./MenuDrawer'), {
    ssr: false,
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLanguage = localStorage.getItem('preferredLanguage');
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      }
    }
  }, []);

  const [language, setLanguage] = React.useState(selectedLanguage);
  let hasSeenTutorial = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedValue = localStorage.getItem('hasSeenTutorial');
    if (storedValue !== null) {
      hasSeenTutorial = storedValue === 'true'; // Convert string 'true' or 'false' to boolean
    }
  }

  const getMessage = () => {
    if (modalOpen) return t('COMMON.SURE_LOGOUT');
    return '';
  };

  const handleAction = () => {
    handleLogoutClick();
  };

  const handleCloseModel = () => {
    setModalOpen(false);
  };

  const logoutOpen = () => {
    handleClose();
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        height: '64px',
      }}
    >
      <Box
        className="w-md-100 ps-md-relative"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: hasSeenTutorial ? 'fixed' : 'relative',
          top: '0px',
          zIndex: '999',
          width: '100%',
          bgcolor: ' #FFFFFF',
        }}
      >
        <Stack
          width={'100%'}
          // padding={'8px 0'}
          direction="row"
          justifyContent={'space-between'}
          alignItems={'center'}
          height="64px"
          boxShadow="0px 1px 3px 0px #0000004D"
          className="pl-md-20"
        >
          <Box
            onClick={toggleDrawer(true)}
            mt={'0.5rem'}
            className="display-md-none"
            paddingLeft={'20px'}
          >
            <Image
              height={12}
              width={18}
              src={menuIcon}
              alt="logo"
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <Image
            height={40}
            width={44}
            src={logoLight}
            alt="logo"
            onClick={() => router.push('/dashboard')}
          />
          <Box
            onClick={handleClick}
            sx={{ cursor: 'pointer', position: 'relative' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : 'false'}
            paddingRight={'20px'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            mt={'0.5rem'}
          >
            <Image
              height={20}
              width={20}
              src={accountIcon}
              alt="logo"
              style={{ cursor: 'pointer' }}
            />
            {/* <AccountCircleIcon
              fontSize="large"
              className="accIcon"
              style={{ fill: theme.palette.warning['A200'] }}
            /> */}
          </Box>
          <div style={{ position: 'absolute' }}>
            <StyledMenu
              id="profile-menu"
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {pathname !== `/user-profile/${userId}` && (
                <MenuItem
                  onClick={handleProfileClick}
                  disableRipple
                  sx={{ 'letter-spacing': 'normal' }}
                >
                  <PersonOutlineOutlinedIcon />
                  {t('PROFILE.MY_PROFILE')}{' '}
                </MenuItem>
              )}
              <MenuItem
                onClick={logoutOpen}
                disableRipple
                sx={{ 'letter-spacing': 'normal' }}
              >
                <LogoutOutlinedIcon />
                {t('COMMON.LOGOUT')}
              </MenuItem>
            </StyledMenu>
          </div>
        </Stack>
      </Box>

      <ConfirmationModal
        message={getMessage()}
        handleAction={handleAction}
        buttonNames={{
          primary: t('COMMON.LOGOUT'),
          secondary: t('COMMON.CANCEL'),
        }}
        handleCloseModal={handleCloseModel}
        modalOpen={modalOpen}
      />

      <MenuDrawer
        toggleDrawer={toggleDrawer}
        open={openDrawer}
        language={language}
        setLanguage={setLanguage}
      />
    </Box>
  );
};
export default Header;
