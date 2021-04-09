import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { favorite_brewery, fetch_brewery } from "./api";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { Star, StarFill, ArrowLeft } from "react-bootstrap-icons";
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker';
import ReviewSection from './ReviewSection';
import { clear_banners } from './store';

function BreweryShow({ brewery, dispatch }) {
  const [favorite, setFavorite] = useState(false);
  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    if (!brewery) {
      fetch_brewery(id).then((data) => {
        if (data.brewery) {
          setFavorite(data.brewery.favorite);
        } else if (data.error) {
          clear_banners();
          history.push("/");
          let action = {
            type: "error/set",
            data: data.error
          }
          dispatch(action);
        }
      });
    }
  }, [brewery]);

  function toggleFavorite(favorite) {
    favorite_brewery(brewery.id, favorite);
    setFavorite(favorite);
  }

  // Credit https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  function goBack() {
    clear_banners();
    history.push("/");
  }

  function inviteFriends() {
    let action = {
      type: 'meetConfig/set',
      data: {
        show: true,
        brewery: {
          id: brewery.id,
          name: brewery.name
        }
      }
    }
    dispatch(action);
  }

  if (!brewery) return <Row><Col className="text-center"><Spinner animation="border" variant="primary" className="my-5" /></Col></Row>;

  return <div>
    <Row className="mb-4">
      <Col xs={6}>
        <Button onClick={goBack} className="mr-3"><span><ArrowLeft className="mb-1" /> Back to Home </span></Button>
      </Col>
      <Col xs={6} className="text-right">
        <Button variant="success" onClick={inviteFriends}>Invite Friends</Button>
      </Col>
    </Row>
    <Row>
      {brewery.latitude && brewery.longitude && 
        <Col md={5}>
          <GoogleMapReact
            bootstrapURLKeys={{key: process.env.REACT_APP_MAPS_API_KEY}}
            defaultCenter={{lat: Number(brewery.latitude), lng: Number(brewery.longitude)}}
            defaultZoom={13}>
              <MapMarker lat={brewery.latitude} lng={brewery.longitude} scale={2} key={`map${brewery.id}`} text={brewery.name} tipId={`marker${brewery.id}`}/>
          </GoogleMapReact>
        </Col>
      }
      <Col md={7}>  
        <Row>
          <Col className="text-right">
            <b>Type: </b> {brewery.brewery_type}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h2>{brewery.name}<span className="ml-3">
            { favorite ?
              <StarFill style={{height: "0.75em", width: "0.75em", color: "yellow"}} onClick={() => toggleFavorite(false)} /> :
              <Star style={{height: "0.75em", width: "0.75em"}} onClick={() => toggleFavorite(true)} />
            }
            </span></h2>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h6><a href={brewery.website_url} target="_blank" rel="noreferrer">{brewery.website_url}</a></h6>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h6>{formatPhoneNumber(brewery.phone)}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>{brewery.street}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>{brewery.city}, {brewery.state} {brewery.postal_code.split("-")[0]}</h6>
          </Col>
        </Row>
        <Row className="my-5">
          &nbsp;
        </Row>
      </Col>
    </Row>
    <Row className="mt-4">
      <Col md={{offset: 1, span: 10}}>
        <ReviewSection breweryId={brewery.id} myReview={brewery.review}/>
      </Col>
    </Row>
  </div>
}

export default connect(({ brewery }) => ({ brewery }))(BreweryShow);