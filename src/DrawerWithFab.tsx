import Fab from '@mui/material/Fab';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

export default function DrawerWithFab({ icon, content, anchor, fabPosition, isOpen, toggleDrawer }: { icon: React.ReactNode, content: React.ReactNode, anchor: 'left' | 'right' | 'top' | 'bottom', fabPosition: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', isOpen: boolean, toggleDrawer: () => void }) {
  const fabBoxPosition = (fabPosition: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    switch (fabPosition) {
      case 'topLeft':
        return { top: 0, left: 0 };
      case 'topRight':
        return { top: 0, right: 0 };
      case 'bottomLeft':
        return { bottom: 0, left: 0 };
      case 'bottomRight':
        return { bottom: 0, right: 0 };
    }
  }

  const drawerContentSx = {
    width: 250,
    padding: '1rem'
  }

  return (
    <>
      <Box sx={{
        position: 'fixed',
        padding: '1rem',
        ...fabBoxPosition(fabPosition)
      }}>
        <Fab onClick={toggleDrawer} sx={{boxShadow: 0}}>
          {icon}
        </Fab>
      </Box>

      <Drawer
        variant='temporary'
        anchor={anchor}
        open={isOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{...drawerContentSx}}>
          {content}
        </Box>
      </Drawer>
    </>
  );
}