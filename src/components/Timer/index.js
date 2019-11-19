import React, { useState } from 'react';
import styles from "./style.less";



const Timer = (props) => {

  const { seconds, onFinish, paused, style } = props
  const [time, setTime] = useState(seconds);

  const timer = setTimeout(function() {
    if (!paused) setTime(time - 1);
  }, 1000);

  if (time === 0) {
    clearTimeout(timer);
    if (onFinish)  onFinish();

  }
  const transformTime = time =>
    new Date(time * 1000).toISOString().substr(14, 5);

  return (
      <span className={styles.timer} style={style}>
        <span className={time % 2 ? styles.dotClear: styles.dotRed } />
        {`${transformTime(seconds - time)} / ${transformTime(seconds)}`}
      </span>
  );
};

export default Timer;
