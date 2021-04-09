import { useEffect, useState } from "react";
import { create_review, fetch_reviews, pfp_path, update_review } from "./api";
import { Row, Col, Form, Spinner, Card, Image, Button } from "react-bootstrap";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Star, StarFill } from 'react-bootstrap-icons';
import { connect } from "react-redux";

function StarInput({ stars, setStars }) {
  return <div className="ml-3 mb-2">
    {
      [1,2,3,4,5].map(n => 
        stars >= n ?
          <StarFill style={{height: "2.5em", width: "2.5em", color: "yellow"}} onClick={() => setStars(n)} key={n}/> :
          <Star style={{height: "2.5em", width: "2.5em"}} onClick={() => setStars(n)} key={n} />
      )
    }
  </div>
}

function ReviewForm({ breweryId, myReview, user }) {
  const [review, setReview] = useState(myReview);
  const [stars, setStars] = useState(myReview?.stars || 0);
  const [body, setBody] = useState(myReview?.body || "");
  
  function submitReview(ev) {
    ev.preventDefault();
    if (review) {
      update_review(review.id, breweryId, stars, body);
    } else {
      create_review(breweryId, stars, body).then((rev_id) => {
        setReview({
          id: rev_id,
          body: body,
          stars: stars
        })
      })
    }
  }

  return <Form onSubmit={submitReview} className="mb-3">
    <Row>
      <Col md={1} className="text-right">
        { user?.pfp_hash &&
          <Image style={{maxHeight: "3rem"}} src={pfp_path(user.pfp_hash)} />
        }
      </Col>
      <Col md={11}>
        <StarInput stars={stars} setStars={setStars}/>
        <Form.Control as="textarea" value={body} onChange={ev => setBody(ev.target.value)} placeholder="(Optional) Add a comment..."/>
        <div className="text-right my-1">
          {review ?
            <Button type="submit" variant="info" disabled={stars === 0}>Edit Review</Button> :
            <Button type="submit" variant="primary" disabled={stars === 0}>Submit Review</Button>
          }
        </div>
      </Col>
    </Row>
  </Form>
}

function StarDisplay({ stars }) {
  return <div className="ml-3 mb-2">
    {
      [1,2,3,4,5].map(n => 
        stars >= n ?
          <StarFill style={{height: "2em", width: "2em", color: "yellow"}} key={n}/> :
          <Star style={{height: "2em", width: "2em"}} key={n}/>
      )
    }
  </div>
}

function ReviewBlock({ review }) {
  return <Row className="my-2">
    <Col md={1}>
      { review.user.pfp_hash &&
        <Image style={{maxHeight: "3rem"}} src={pfp_path(review.user.pfp_hash)} />
      }
    </Col>
    <Col md={11}>
      <Row>
        <Col>
          <b>{review.user.name}</b>'s review:
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <StarDisplay stars={review.stars}/>
                </Col>
                <Col md={6} className="text-right">
                  <b>{review.date}</b>
                </Col>
              </Row>
              {review.body &&
                <Row className="mt-2">
                  <Col>
                    <p className="ml-3">{review.body}</p>
                  </Col>
                </Row>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  </Row>
}

function ReviewSection({ breweryId, myReview, user, dispatch }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch_reviews(breweryId, 0).then((data) => {
      setPage(1);
      let reviews1 = reviews;
      setReviews(reviews1.concat(data))
      if (data.length < 10) {
        setDone(true);
      }
    })
  }, [breweryId])

  function fetchReviews() {
    if (!done) {
      fetch_reviews(breweryId, page + 1).then((data) => {
        setPage(page + 1);
        let reviews1 = reviews;
        setReviews(reviews1.concat(data))
        if (data.length < 10) {
          setDone(true);
        }
      })
    }
  }

  return <Card>
    <Card.Body>
      <Row>
        <Col>
          <ReviewForm breweryId={breweryId} myReview={myReview} user={user} />
        </Col>
      </Row>
      <Row>
        <Col>
          <InfiniteScroll 
              dataLength={reviews.length}
              next={fetchReviews}
              hasMore={!done}
              loader={<div className="text-center"><Spinner animation="border" variant="primary" className="my-5" /></div>}
            >
            {reviews.map(r => <ReviewBlock review={r} key={r.id} />)}
          </InfiniteScroll>
        </Col>
      </Row>
    </Card.Body>
  </Card>
}

export default connect(({ user }) => ({ user }))(ReviewSection);