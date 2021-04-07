import { Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function DismissibleAlert({ variant, message }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, [message])

  if (show) {
    return <Alert variant={variant} onClose={() => setShow(false)} dismissible>{message}</Alert>
  }
  return null;
}

export default DismissibleAlert;