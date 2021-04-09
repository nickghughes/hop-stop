import { connect } from 'react-redux';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { next_breweries } from '../api';
import { Row, Col, Spinner, Card, Button } from 'react-bootstrap';
import Filters from './Filters';
import { useHistory } from 'react-router-dom';
import { capitalize } from 'lodash';
import { clear_banners } from '../store';

function BreweryListing({ brewery, dispatch }) {
  let history = useHistory();

  function showBrewery() {
    clear_banners();
    let action = {
      type: 'brewery/set',
      data: null
    }
    dispatch(action)
    history.push(`/breweries/${brewery.id}`);
  }

  return <Card>
    <Card.Body>
      <Card.Title><h4>{brewery.name}</h4></Card.Title>
      <Row>
        <Col md={8}>
          <Card.Text className="mb-0"> {brewery.street} </Card.Text>
          <Card.Text> {brewery.city}, {brewery.state} {brewery.postal_code.split("-")[0]}</Card.Text>
          <Card.Subtitle><small><b>Type: </b> {capitalize(brewery.brewery_type)}</small></Card.Subtitle>
        </Col>
        <Col md={4}>
          <Button variant="info" onClick={showBrewery}>View</Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
}

function Feed({ breweries, filters, dispatch }) {
  const [fetching, setFetching] = useState(false);
  const [done, setDone] = useState(false);

  function nextPage() {
    if (!fetching) {
      setFetching(true);
      next_breweries().then((data) => {
        if (data.data.results.length < 10) {
          setDone(true);
        }
        setFetching(false);
      });
    }
  }

  let feedHeight = window.innerHeight * 0.7;

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Filters onChange={() => setDone(false)}/>
        </Col>
      </Row>
      <Row style={{height: feedHeight}}>
        {breweries ?
          <Col>
            {breweries.length ?
              <InfiniteScroll
                dataLength={breweries.length}
                next={nextPage}
                hasMore={!done}
                height={feedHeight}
                loader={<div className="text-center"><Spinner animation="border" variant="primary"/></div>}
              >
                {breweries.map(b => <BreweryListing brewery={b} dispatch={dispatch} key={b.id}/>)}
              </InfiniteScroll>
              : <div className="text-center mt-5"><h3>No results.</h3></div>
            }
          </Col> :
          <Col className="text-center">
            {
              (filters.coords || filters.locationStr || filters.favorite) ?
                <Spinner animation="border" variant="primary" className="mt-5"/> :
                <h4 className="mt-5">Please choose a location above to search</h4>
            }
          </Col>
        }
      </Row>
    </div>
  );
}

export default connect(({breweries, filters}) => ({breweries, filters}))(Feed)