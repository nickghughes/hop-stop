import { connect } from "react-redux";
import { Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Star, StarFill, FilterRight } from "react-bootstrap-icons";
import { useState } from "react";
import { capitalize } from "lodash";
import { fetch_breweries } from "./api";

function Filters({filters, dispatch}) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [locationStr, setLocationStr] = useState(filters.locationStr || "");

  function saveFilters(f) {
    let action = {
      type: 'filters/set',
      data: f
    }
    dispatch(action);

    if (f.coords) {
      fetch_breweries(f.coords);
    }
    if (f.locationStr) {
      if (!isNaN(f.locationStr)) {
        fetch_breweries({by_postal: f.locationStr})
      } else {
        let [city, state] = f.locationStr.split(",").map(n => n.trim());
        city = city.split(" ").map(n => capitalize(n)).join(" ");
        state = state.length == 2 ? state.toUpperCase() : capitalize(state);
        console.log(city, state);
        fetch_breweries({by_city: city, by_state: state});
      }
    }
  }

  function updateSearchTerm() {
    let filters1 = Object.assign({}, filters);
    filters1.searchTerm = searchTerm;
    saveFilters(filters1);
  }

  function getLocation() {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        let filters1 = Object.assign({}, filters);
        filters1.coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        delete filters1.locationStr;
        saveFilters(filters1);
        setLocationLoading(false);
      }, () => {
        let action = {
          type: 'error/set',
          data: "Could not get location"
        }
        dispatch(action);
        setLocationLoading(false);
      }, {timeout: 10000});
    } else {
      alert("Cannot get location");
    }
  }

  function setLocationDisabled() {
    return locationStr.length === 0 || (isNaN(locationStr) ? !locationStr.includes(",") : locationStr.length !== 5);
  }

  function setLocation() {
    let filters1 = Object.assign({}, filters);
    filters1.locationStr = locationStr;
    delete filters1.coords;
    saveFilters(filters1);
  }

  function toggleFavorite() {
    let filters1 = Object.assign({}, filters);
    filters1.favorite ? 
      delete filters1.favorite :
      filters1.favorite = true;
    saveFilters(filters1);
  }

  function editFilters() {
    // TODO
  }

  return <div>
    <Row>
      <Col xs={11}>
        <InputGroup>
          <Form.Control type="text" placeholder="Search breweries..." value={searchTerm} onChange={(ev) => setSearchTerm(ev.target.value)} />
          <InputGroup.Append>
            <Button variant="info" disabled={searchTerm.length === 0} onClick={updateSearchTerm}>Search</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
      <Col xs={1} className="pl-0 mt-1">
        { filters.favorite ?
          <StarFill style={{height: "1.5em", width: "1.5em", color: "yellow"}} onClick={toggleFavorite} /> :
          <Star style={{height: "1.5em", width: "1.5em"}} onClick={toggleFavorite} />
        }
        
      </Col>
    </Row>
    <Row className="mt-2">
      <Col xs={11}>
          <Row>
            <Col xs={3} className="mt-1 mr-0 pr-0">
              <Button className="btn-sm" onClick={getLocation} disabled={filters.coords}>
                {locationLoading ?
                  <Spinner animation="border" variant="primary" style={{height:"1em", width: "1em"}} /> :
                  <small>Use My Location</small>
                }
              </Button>
            </Col>
            <Col xs={1} className="mr-0 pr-0 mt-2">
              <p> or </p>
            </Col>
            <Col xs={8}>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter 'City, State' or ZIP" value={locationStr} onChange={(ev) => setLocationStr(ev.target.value)}/>
                <InputGroup.Append>
                  <Button variant="info" disabled={setLocationDisabled()} onClick={setLocation}>Apply</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
      </Col>
      <Col xs={1} className="pl-0 mt-1">
        <FilterRight style={{height: "1.5em", width: "1.5em"}}/>
      </Col>
    </Row>
  </div>
}

export default connect(({filters}) => ({filters}))(Filters);