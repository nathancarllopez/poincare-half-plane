import './App.css';
import { useState } from 'react';
import Canvas from './Canvas.tsx';
import Toolbar from './Toolbar.tsx';
import ToolbarConfig from './ToolbarConfig';

function App() {
  const [toolbarConfig, setToolbarConfig] = useState<ToolbarConfig>(new ToolbarConfig());

  function handleToolbarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const toolbar = event.currentTarget.closest('.toolbar');
    if (!toolbar) return;

    const configCopy = new ToolbarConfig(toolbar);
    setToolbarConfig(configCopy);
  }

  return (
    <div className="appContainer">
      {/* Infobar component goes here */}
      <Canvas toolbarConfig={toolbarConfig} />
      <Toolbar onToolbarChange={handleToolbarChange} />
    </div>
  )
}

export default App