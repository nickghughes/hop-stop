import { Container, Card } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Landing from './components/Landing';
import Profile from './components/Profile';
import BreweryShow from './components/BreweryShow';
import MeetMeHereFlow from "./components/MeetMeHereFlow";
import './App.scss';

function App() {
  return (
    <Container>
      <TopBar />
      <MeetMeHereFlow />
      <Card>
        <Card.Body>
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>
            <Route path="/profile" exact>
              <Profile />
            </Route>
            <Route path="/breweries/:id" exact>
              <BreweryShow />
            </Route>
          </Switch>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
