import { PinFill } from 'react-bootstrap-icons';
import ReactTooltip from 'react-tooltip';

function MapMarker({ color, text, tipId }) {
  return (
    <div>
      <PinFill data-tip data-for={tipId} style={{color}} className="icon-xl" />
      <ReactTooltip id={tipId} type="light">{text}</ReactTooltip>
    </div>
  );
}

export default MapMarker;