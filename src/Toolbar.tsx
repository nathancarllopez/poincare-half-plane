import React, { useState } from 'react';

import AcUnitIcon from '@mui/icons-material/AcUnit';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export default function Toolbar() {
  const initialToolbarState = {
    draw: {
      displayedName: 'Select Shape',
      icon: <LocationDisabledIcon />,
      anchorEl: null,
      items: [
        { name: 'Select Shape', icon: <LocationDisabledIcon />, selected: true },
        { name: 'Draw Points', icon: <AdsClickIcon />, selected: false },
        { name: 'Draw Geodesics', icon: <AcUnitIcon />, selected: false }
      ]
    }
  };
  const [toolbarState, setToolbarState] = useState(initialToolbarState);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, menuName: string) {
    const newToolbarState = { ...toolbarState };
    newToolbarState[menuName].anchorEl = event.currentTarget;
    setToolbarState(newToolbarState);
  }

  function handleMenuClose(menuName: string) {
    const newToolbarState = { ...toolbarState };
    newToolbarState[menuName].anchorEl = null;
    setToolbarState(newToolbarState);
  }

  function handleMenuClick(menuName: string, clickedItem: { name: string, icon: React.ReactNode, selected: boolean }) {
    const newToolbarState = {
      ...toolbarState,
      [menuName]: {
        ...toolbarState[menuName],
        displayedName: clickedItem.name,
        icon: clickedItem.icon,
        anchorEl: null,
        items: toolbarState[menuName].items.map(item => {
          if (item.name === clickedItem.name) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          return item;
        })
      }
    };
    setToolbarState(newToolbarState);
  }

  return (
    <div className="toolbarContainer">
      <Typography variant={'h3'}>
        Toolbar
      </Typography>
      
      <Divider />

      <List>
        {Object.entries(toolbarState).map(([menuName, menuState]) => (
          <>
            <ListItem key={menuName} disablePadding>
              <ListItemButton onClick={(event) => handleMenuOpen(event, menuName)}>
                <ListItemIcon>
                  {menuState.icon}
                </ListItemIcon>
                <ListItemText primary={menuState.displayedName} />
              </ListItemButton>
            </ListItem>
            <Menu
              key={`${menuName}Menu`}
              anchorEl={menuState.anchorEl}
              open={menuState.anchorEl !== null}
              onClose={() => handleMenuClose(menuName)}
            >
              {menuState.items.map((item) => (
                <MenuItem 
                  key={item.name}
                  selected={item.selected}
                  onClick={() => handleMenuClick(menuName, item)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    {item.name}
                  </ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </>
        ))}
      </List>
    </div>
  );
}

// export default function Toolbar({ onToolbarChange }: { onToolbarChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
//   const [clickToolMenuAnchorEl, setClickToolMenuAnchorEl] = useState<null | HTMLElement>(null);
  
//   function handleClickToolMenuClick(event: React.MouseEvent<HTMLDivElement>) {
//     setClickToolMenuAnchorEl(event.currentTarget);
//   }
//   function handleClickToolMenuClose() {
//     setClickToolMenuAnchorEl(null);
//   }

//   return (
//     <div id='toolbarContainer' onChange={onToolbarChange}>
//       <Typography variant={'h3'}>
//         Toolbar
//       </Typography>
      
//       <Divider />

//       <List>
//         <ListItem disablePadding>
//           <ListItemButton id='clickToolMenuButton' onClick={handleClickToolMenuClick}>
//             <ListItemIcon>
//               <AdsClickIcon />
//             </ListItemIcon>
//             <ListItemText primary="Draw Points" />
//           </ListItemButton>
//           <Menu
//             id="clickToolMenu"
//             anchorEl={clickToolMenuAnchorEl}
//             open={Boolean(clickToolMenuAnchorEl)}
//             onClose={handleClickToolMenuClose}
//           >
//             <MenuItem id='drawPoints' onClick={handleClickToolMenuClose}>Draw Points</MenuItem>
//             <MenuItem id='drawGeodesics' onClick={handleClickToolMenuClose}>Draw Geodesics</MenuItem>
//           </Menu>
//         </ListItem>
//       </List>
//     </div>
//   );
// }

{/* <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List> */}

// import './Toolbar.css';

// export default function Toolbar({ onToolbarChange }: { onToolbarChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
//   return (
//     <div className="toolbar" onChange={onToolbarChange}>

//       <div className="toolbarRow">
//         <label htmlFor="cursorCoordToggle">Show Cursor Coordinates</label>
//         <input type="checkbox" id="cursorCoordToggle" defaultChecked />
//       </div>

//       <div className="toolbarRow">
//         <fieldset>
//           <legend>Click Tool</legend>
//           <label htmlFor="drawPoints">Draw Points</label>
//           <input type="radio" id="drawPoints" name="clickTool" defaultChecked />
//           <label htmlFor="drawGeodesics">Draw Geodesics</label>
//           <input type="radio" id="drawGeodesics" name="clickTool" />
//         </fieldset>
//       </div>

//     </div>
//   );
// }