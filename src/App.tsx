import './App.css';
import { useState } from 'react';

// Custom components
import Canvas from './Canvas.tsx';
import Toolbar from './Toolbar.tsx';
import ToolbarConfig from './ToolbarConfig';
import DrawerWithFab from './DrawerWithFab.tsx';

// Material UI
import InfoIcon from '@mui/icons-material/Info';
import HandymanIcon from '@mui/icons-material/Handyman';

interface DrawerState {
  infoOpen: boolean;
  toolbarOpen: boolean;
}

function App() {
  const [drawerState, setDrawerState] = useState<DrawerState>({ infoOpen: false, toolbarOpen: false });

  function toggleDrawer(drawer: keyof DrawerState) {
    const currDrawerState = drawerState[drawer];
    const newDrawerState = { ...drawerState, [drawer]: !currDrawerState };
    setDrawerState(newDrawerState);
  }

  const [toolbarConfig, setToolbarConfig] = useState<ToolbarConfig>(new ToolbarConfig());

  function handleToolbarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const toolbar = event.currentTarget.closest('.toolbar');
    if (!toolbar) return;

    const configCopy = new ToolbarConfig(toolbar);
    setToolbarConfig(configCopy);
  }

  return (
    <div className="appContainer">
      <DrawerWithFab
        icon={<InfoIcon fontSize='large' />}
        content={<div>Info</div>}
        anchor='left'
        fabPosition='topLeft'
        isOpen={drawerState.infoOpen}
        toggleDrawer={() => toggleDrawer('infoOpen')}
      ></DrawerWithFab>

      <Canvas toolbarConfig={toolbarConfig} />

      <DrawerWithFab
        icon={<HandymanIcon fontSize='large' />}
        content={<Toolbar />}
        anchor='right'
        fabPosition='topRight'
        isOpen={drawerState.toolbarOpen}
        toggleDrawer={() => toggleDrawer('toolbarOpen')}
      ></DrawerWithFab>
    </div>
  );
}

export default App