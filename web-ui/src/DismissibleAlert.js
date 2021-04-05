import { Alert } from 'react-bootstrap';
import { useState } from 'react';

function DismissibleAlert({ variant, message }) {
  const [show, setShow] = useState(true);

  if (show) {
    return <Alert variant={variant} onClose={() => setShow(false)} dismissible>{message}</Alert>
  }
  return null;
}

export default DismissibleAlert;