import { PinFill } from 'react-bootstrap-icons';
import ReactTooltip from 'react-tooltip';

function MapMarker({ color, text, scale, tipId }) {
  return (
    <div>
      <PinFill data-tip data-for={tipId} style={{height: `${scale}em`, width: `${scale}em`, color}} className="pin" />
      <ReactTooltip id={tipId} type="light">{text}</ReactTooltip>
    </div>
  );
}

export default MapMarker;