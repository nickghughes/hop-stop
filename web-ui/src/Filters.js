import { connect } from "react-redux";
import { Row, Col, Form, Button, InputGroup, Spinner, Dropdown, DropdownButton } from "react-bootstrap";
import { Star, StarFill, FilterRight } from "react-bootstrap-icons";
import { useState } from "react";
import { fetch_breweries } from "./api";

function TypeFilter({ currentType, setType }) {
  // Taken from API documentation
  const breweryTypes = ["Micro", "Nano", "Regional", "Brewpub", "Planning", "Contract", "Proprietor"];

  return <Dropdown.Menu>
      {breweryTypes.map((type) => 
        <Dropdown.Item as="button" onClick={() => setType(type.toLowerCase())} key={type}>
          {currentType == type.toLowerCase() ? <b>{type}</b> : type}
        </Dropdown.Item>
      )}
    </Dropdown.Menu>
}

function Filters({filters, dispatch, onChange}) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [locationStr, setLocationStr] = useState(filters.locationStr || "");
  const [type, setType] = useState();

  function saveFilters(f) {
    onChange();
    delete f.next_page;
    let action = {
      type: 'filters/set',
      data: f
    }
    dispatch(action);

    fetch_breweries(f);
  }

  function updateSearchTerm() {
    let filters1 = Object.assign({}, filters);
    filters1.searchTerm = searchTerm;
    saveFilters(filters1);
  }

  function clearSearchTerm() {
    let filters1 = Object.assign({}, filters);
    delete filters1.searchTerm;
    setSearchTerm("");
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

  function updateType(t) {
    let filters1 = Object.assign({}, filters);
    if (type === t) {
      setType(undefined);
      delete filters1.type;
    } else {
      setType(t);
      filters1.type = t;
    }
    saveFilters(filters1);
  }

  return <div>
    <Row>
      <Col xs={11}>
        <InputGroup>
          {filters.searchTerm &&
            <InputGroup.Prepend>
              <Button variant="secondary" onClick={clearSearchTerm}>X</Button>
            </InputGroup.Prepend>
          }
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
      <Col xs={10}>
          <Row>
            <Col xs={4} className="mt-1 mr-0 pr-0">
              <span><Button className="btn-sm" onClick={getLocation} disabled={filters.coords}>
                {locationLoading ?
                  <Spinner animation="border" variant="primary" style={{height:"1em", width: "1em"}} /> :
                  <small>Use My Location</small>
                }
              </Button></span><span className="ml-2">or</span>
            </Col>
            <Col xs={8}>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter 'City, State' or ZIP" value={locationStr} onChange={(ev) => setLocationStr(ev.target.value)}/>
                <InputGroup.Append>
                  <Button variant="info" disabled={locationStr.length === 0} onClick={setLocation}>Apply</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
      </Col>
      <Col xs={2} className="pl-0 ml-0">
        <Dropdown>
          <Dropdown.Toggle size="sm" variant="secondary"><FilterRight style={{height: "1.5em", width: "1.5em"}} className="mb-1 mr-1" /></Dropdown.Toggle>
          <TypeFilter currentType={type} setType={updateType} />
        </Dropdown>
      </Col>
    </Row>
  </div>
}

export default connect(({filters}) => ({filters}))(Filters);