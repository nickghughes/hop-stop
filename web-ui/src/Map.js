import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { PinFill } from 'react-bootstrap-icons';
import ReactTooltip from 'react-tooltip';
import { useState } from 'react';

function Marker({ color, text, scale, tipId }) {
  return (
    <div>
      <PinFill data-tip data-for={tipId} style={{height: `${scale}em`, width: `${scale}em`, color}} className="pin" />
      <ReactTooltip id={tipId} type="light">{text}</ReactTooltip>
    </div>
  );
}

function Map({coords, breweries}) {
  const [avgBCoords, setAvgBCoords] = useState(null);

  function avgBreweryCoords() {
    if (avgBCoords) return avgBCoords;
    if (!breweries) return null;
    let breweriesToUse = breweries.filter(b => b.latitude && b.longitude);
    if (breweriesToUse.length === 0) return null;
    let coords = {lat: 0, lng: 0};
    breweriesToUse.forEach((b) => {
      coords.lat += Number(b.latitude)
      coords.lng += Number(b.longitude)
    })
    coords.lat /= breweriesToUse.length;
    coords.lng /= breweriesToUse.length;
    setAvgBCoords(coords);
    return coords;
  }

  function centerCoords() {
    return coords || avgBreweryCoords();
  }

  return (
    centerCoords() &&
    <GoogleMapReact
      bootstrapURLKeys={{key: process.env.REACT_APP_MAPS_API_KEY}}
      defaultCenter={centerCoords()}
      defaultZoom={11}
    >
      {coords &&
        <Marker lat={coords.lat} lng={coords.lng} color="red" scale={2.5} tipId="self" text="You are here" />
      }
      {breweries &&
        breweries.map(b => (b.latitude && b.longitude) ? <Marker lat={b.latitude} lng={b.longitude} scale={2} key={`map${b.id}`} text={b.name} tipId={`marker${b.id}`}/> : null)
      }
    </GoogleMapReact>
  );
}

export default connect(({coords, breweries}) => ({coords, breweries}))(Map);