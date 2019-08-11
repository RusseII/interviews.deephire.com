import React, { useState } from 'react';
import { Progress } from 'antd';

const Timer = ({ countDown, seconds, onFinish, paused }) => {
  const [time, setTime] = useState(seconds);

  const timer = setTimeout(function() {
    if (!paused) setTime(time - 1);
  }, 1000);

  if (time === 0) {
    clearTimeout(timer);
    onFinish();
  }

  return (
    <div style={{ paddingTop: '12px' }}>
      {' '}
      {countDown ? (
        <Progress
          status="normal"
          width="8vh"
          type="circle"
          format={percent => time}
          percent={(time / seconds) * 100}
        />
      ) : (
        <Progress
          status="normal"
          width="8vh"
          type="circle"
          format={percent => `${seconds - time} sec`}
          percent={(1 - time / seconds) * 100}
        />
      )}
    </div>
  );
};

export default Timer;
