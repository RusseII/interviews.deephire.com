import styles from './index.less';
import React, { useState, useEffect } from 'react';

import { OTPublisher } from 'opentok-react';  

const Video = props => {
  const {  screen } = props;

  const [options, setOptions] = useState({ opacity: 0.3, text: 'Prepare' });

  useEffect(() => {
    switch (screen) {
      case 'record':
        setOptions({ opacity: 1, text: '',  display: "block" });
        break;
      case 'prepare':
        setOptions({ opacity: 0.3, text: 'Prepare',  display: "block" });
        break;
      case 'review':
        setOptions({ opacity: 0.3, text: '', display: "none" });
        break;
      default:
        console.log('Invalid screen prop');
    }
  }, [screen]);

  return (
    <>
      <div className={styles.video} style={{ display: options.display, opacity: options.opacity }}>
        <OTPublisher {...props}  />
      </div>
      <div
        className={styles.center}
      >
        <h1>{options.text}</h1>
      </div>
    </>
  );
};
export default Video;
