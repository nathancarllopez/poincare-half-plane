import './Toolbar.css';

export default function Toolbar({ onToolbarChange }: { onToolbarChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="toolbar" onChange={onToolbarChange}>

      <div className="toolbarRow">
        <label htmlFor="cursorCoordToggle">Show Cursor Coordinates</label>
        <input type="checkbox" id="cursorCoordToggle" defaultChecked />
      </div>

      <div className="toolbarRow">
        <fieldset>
          <legend>Click Tool</legend>
          <label htmlFor="drawPoints">Draw Points</label>
          <input type="radio" id="drawPoints" name="clickTool" defaultChecked />
          <label htmlFor="drawGeodesics">Draw Geodesics</label>
          <input type="radio" id="drawGeodesics" name="clickTool" />
        </fieldset>
      </div>

    </div>
  );
}