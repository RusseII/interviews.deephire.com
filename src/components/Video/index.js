import styles from './index.less';
import React, { useState, useEffect } from 'react';

import { OTPublisher } from 'opentok-react';

const Video = props => {
  const {  screen } = props;

  const [recordingOn, setRecordingOn] = useState({ opacity: 0.3, text: 'Prepare' });

  useEffect(() => {
    switch (screen) {
      case 'record':
        setRecordingOn({ opacity: 1, text: '',  display: "block" });
        break;
      case 'prepare':
        setRecordingOn({ opacity: 0.3, text: 'Prepare',  display: "block" });
        break;
      case 'review':
        setRecordingOn({ opacity: 0.3, text: '0', display: "none" });
        break;
      default:
        console.log('Invalid Screen Prop');
    }
  }, [screen]);

  return (
    <>
      <div style={{ display: recordingOn.display, opacity: recordingOn.opacity }}>
        <OTPublisher {...props} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <h1>{recordingOn.text}</h1>
      </div>
    </>
  );
};
export default Video;
