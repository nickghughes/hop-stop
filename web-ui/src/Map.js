import { connect } from 'react-redux';
import GoogleMapReact, { fitBounds } from 'google-map-react';
import { useRef } from 'react'
import useBoundingclientrect from "@rooks/use-boundingclientrect";
import MapMarker from './MapMarker';

function Map({coords, breweries}) {
  const mapRef = useRef();
  const mapRect = useBoundingclientrect(mapRef);

  function bounds() {
    let lats = []; let lngs = [];

    if (coords) {
      lats.push(coords.lat);
      lngs.push(coords.lng)
    }

    if (breweries) {
      breweries.forEach((b) => {
        lats.push(Number(b.latitude));
        lngs.push(Number(b.longitude));
      })
    }

    if (lats.length) {
      let l =  {
        nw: {
          lat: Math.max(...lats),
          lng: Math.min(...lngs)
        },
        se: {
          lat: Math.min(...lats),
          lng: Math.max(...lngs)
        }
      }
      return l;
    }

    return {
      nw: {
        lat: 50.01038826014866,
        lng: -118.6525866875
      },
      se: {
        lat: 32.698335045970396,
        lng: -32.0217273125
      }
    };
  }

  let c, z;
  if (mapRect) {
    let {center, zoom} = fitBounds(bounds(), { height: mapRect.height, width: mapRect.width });
    c = center;
    z = zoom;
  }

  return (
    <div ref={mapRef} className="h-100">
      <GoogleMapReact
        bootstrapURLKeys={{key: process.env.REACT_APP_MAPS_API_KEY}}
        center={c}
        zoom={z}
      >
        {coords &&
          <MapMarker lat={coords.lat} lng={coords.lng} color="red" tipId="self" text="You are here" />
        }
        {breweries &&
          breweries.map(b => (b.latitude && b.longitude) ? <MapMarker lat={b.latitude} lng={b.longitude} key={`map${b.id}`} text={b.name} tipId={`marker${b.id}`}/> : null)
        }
      </GoogleMapReact>
    </div>
  );
}

export default connect(({coords, breweries}) => ({coords, breweries}))(Map);