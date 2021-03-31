import { connect } from 'react-redux';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { next_breweries, fetch_breweries } from './api';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import Filters from './Filters';

function BreweryListing({ brewery }) {
  return <Card>
    <Card.Body>
      <Card.Title><h4>{brewery.name}</h4></Card.Title>
      <Card.Text className="mb-0"> {brewery.street} </Card.Text>
      <Card.Text> {brewery.city}, {brewery.state} {brewery.postal_code.split("-")[0]}</Card.Text>
      <Card.Subtitle><small><b>Type: </b> {brewery.brewery_type}</small> </Card.Subtitle>
    </Card.Body>
  </Card>
}

function Feed({ breweries, filters }) {
  const [fetching, setFetching] = useState(false);

  function nextPage() {
    console.log(fetching)
    if (!fetching) {
      console.log(fetching)
      setFetching(true);
      next_breweries().then(() => setFetching(false));
    }
  }

  let feedHeight = window.innerHeight * 0.7;

  return (
    <div>
      <Row>
        <Col>
          <Filters />
        </Col>
      </Row>
      <Row>
        {breweries ?
          <Col>
            <InfiniteScroll
              dataLength={breweries.length}
              next={nextPage}
              hasMore={true}
              height={feedHeight}
              loader={<Row className="text-center"><Spinner animation="border" variant="primary"/></Row>}
            >
              {breweries.map(b => <BreweryListing brewery={b} key={b.id}/>)}
            </InfiniteScroll>
          </Col> :
          <Col style={{height: feedHeight}} className="text-center">
            {
              (filters.coords || filters.locationStr) ?
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