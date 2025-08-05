import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(c => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2>{counter > 0 ? `Thời gian còn lại: ${counter}s` : 'Hết giờ!'}</h2>
    </div>
  );
}

export default CountdownTimer;
