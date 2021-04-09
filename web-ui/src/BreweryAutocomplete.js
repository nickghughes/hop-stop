import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import { Multiselect } from 'multiselect-react-dropdown';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState, useRef } from 'react';
import { autocomplete_breweries, fetch_meet_me_heres, send_meet_me_heres } from './api';

const AsyncTypeahead = withAsync(Typeahead);

function BreweryAutocomplete({ meetConfig, friends, dispatch }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState();

  let multiselectRef = useRef();

  function handleClose() {
    let action = {
      type: 'meetConfig/set',
      data: null
    }
    dispatch(action);
  }

  function onSelectBrewery(opt) {
    let meetConfig1 = Object.assign({}, meetConfig);
    if (meetConfig?.brewery) {
      meetConfig1.users = opt;
    } else {
      meetConfig1.brewery = opt[0];
      let action = {
        type: 'meetConfig/set',
        data: meetConfig1
      }
      dispatch(action);
    }
  }

  function onSelectFriend(list, item) {
    let meetConfig1 = Object.assign({}, meetConfig);
    meetConfig1.users = list;
    let action = {
      type: 'meetConfig/set',
      data: meetConfig1
    }
    dispatch(action);
    multiselectRef.current.resetSelectedValues();
  }

  function onRemoveFriend(list, item) {
    let meetConfig1 = Object.assign({}, meetConfig);
    meetConfig1.users = list;
    let action = {
      type: 'meetConfig/set',
      data: meetConfig1
    }
    dispatch(action);
    multiselectRef.current.resetSelectedValues();
  }

  function queryResults(query) {
    if (meetConfig?.brewery) return;
    setLoading(true);
    autocomplete_breweries(query).then((data) => {
      setOptions(data.results);
      setLoading(false);
    });
  }

  function sendInvites() {
    send_meet_me_heres(meetConfig.brewery.id, meetConfig.users.map(f => f.id)).then(() => {
      let action = {
        type: 'meetConfig/set',
        data: null
      }
      dispatch(action);
      fetch_meet_me_heres();
    })
  }

  function selectAll() {
    let meetConfig1 = Object.assign({}, meetConfig);
    meetConfig1.users = friends?.friends;
    let action = {
      type: 'meetConfig/set',
      data: meetConfig1
    }
    dispatch(action);
    multiselectRef.current.resetSelectedValues();
  }

  function clearSelections() {
    let meetConfig1 = Object.assign({}, meetConfig);
    meetConfig1.users = [];
    let action = {
      type: 'meetConfig/set',
      data: meetConfig1
    }
    dispatch(action);
    multiselectRef.current.resetSelectedValues();
  }

  let body = null;
  if (meetConfig?.brewery) {
    body = <div>
        <div className="text-right">
          <Button variant="link" className="btn-sm" onClick={selectAll}>Select all</Button>
          <Button variant="link text-danger" className="btn-sm" onClick={clearSelections}>Clear</Button>
        </div>
        <Multiselect 
          options={friends?.friends || []}
          selectedValues={meetConfig?.users || []}
          onSelect={onSelectFriend}
          onRemove={onRemoveFriend}
          ref={multiselectRef}
          displayValue="name"
        />
        <div className="text-right">
          <Button variant="primary" className="mt-2" onClick={sendInvites} disabled={(meetConfig?.users?.length || 0) === 0}>Send invites</Button>
        </div>
      </div>
  } else {
    body =  <AsyncTypeahead
              id="brewery-typeahead"
              isLoading={loading}
              placeholder={"Search breweries..."}
              labelKey={item => item.name}
              onSearch={queryResults}
              onChange={onSelectBrewery}
              options={options}
            />
  }

  let title = meetConfig?.brewery ? 
                `Who do you want to invite to ${meetConfig.brewery.name}?` :
                "What brewery are you drinking at?";
  return <Modal show={meetConfig?.show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {body}
    </Modal.Body>
  </Modal>
}

export default connect(({ meetConfig, friends }) => ({ meetConfig, friends }))(BreweryAutocomplete);