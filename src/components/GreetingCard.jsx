import React from 'react';
import { format } from 'date-fns';
import './GreetingCard.css';

const GreetingCard = () => {
  // Get today's date and time
  const now = new Date();
  const formattedDate = format(now, 'MMM dd, yyyy');
  const formattedTime = format(now, 'EEEE, hh:mm a');

  return (
    <div className="greeting-card">
      <h5>Hello, <span className="user-name">Name!</span></h5>
      <p>{formattedDate} | {formattedTime}</p>
    </div>
  );
};

export default GreetingCard;
