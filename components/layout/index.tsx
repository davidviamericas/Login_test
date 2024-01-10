import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Monitor from '../axios_monitor/monitor';
import { userInfoProps } from '../../common/types';
import userInfo from "../../common/stores/user_info";
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from '../../common/Loader';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children: JSX.Element
}

var intervalId: any;

const drawerWidth = 240;
const navItems = [{
  name: 'Sender',
  path: '/sender'
},
{
  name: 'Recipients',
  path: '/recipient'
},
{
  name: 'Plaid',
  path: '/plaid'
},
{
  name: 'Transactions',
  path: '/transactions'
},
{
  name: 'Salir',
  path: '/',
  event: () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}];

export default function Layout(props: Props) {
  const { children } = props;
  const { getEnv, getUserInfo } = userInfo();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const envValue = getEnv();

  React.useEffect(() => {
    const checkSession = () => {
      const data: userInfoProps = getUserInfo();

      if (data.token && data.expiration) {
        const now = new Date();
        const expiration = new Date(data.expiration);

        if (now > expiration) {
          clearInterval(intervalId);
          alert("Your session has expired");
          router.push(`/${envValue ? '?env=' + envValue : ''}`);
        }
      }
    };

    // Llamamos a la función de comprobación al inicio
    checkSession();

    // Configuramos el intervalo
    intervalId = setInterval(checkSession, 3000);

    // Limpiamos el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  const goTo = (item: any) => {
    if (item.event) {
      item.event();
    }
    router.push(`/${item.path}${envValue ? '?env=' + envValue : ''}`);
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Loader />
      <Typography variant="h6" sx={{ my: 2 }}>
        Via Digital
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => goTo(item)}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Loader />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Via Digital
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.name} sx={{ color: '#fff' }} onClick={() => goTo(item)}>
                {item.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" style={{ width: "100%", display: 'flex', marginTop: "60px" }}>
        <Monitor />
        {children}
      </Box>
    </Box>
  );
}