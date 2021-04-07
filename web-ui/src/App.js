import { Container, Card } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import TopBar from './TopBar';
import Landing from './Landing';
import Profile from './Profile';
import BreweryShow from './BreweryShow';
import BreweryAutocomplete from "./BreweryAutocomplete";
import './App.scss';

function App() {
  return (
    <Container>
      <TopBar />
      <BreweryAutocomplete />
      <Card>
        <Card.Body>
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>
            <Route path="/profile" exact>
              <Profile />
            </Route>
            <Route path="/breweries/:id">
              <BreweryShow />
            </Route>
          </Switch>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
