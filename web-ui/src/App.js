import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import TopBar from './TopBar';
import Landing from './Landing';
import './App.scss';

function App() {
  return (
    <Container>
      <TopBar />
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/register" exact>
          <div/>
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
