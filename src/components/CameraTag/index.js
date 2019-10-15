/* global CameraTag */
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import qs from 'qs'
const DetectRTC = require('detectrtc');

const cameraId = 'DeepHire';

const simple = qs.parse(window.location.search)['simple'];

const setupObservers = (onUpload, setCameraTagReady, reAnimateQuestion) => {
  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {

    const myCamera = CameraTag.cameras[cameraId];
    //set timeout is to fix a bug on edge/ie with event queue (reset does not work without it)
    setTimeout(()=> {myCamera.reset()}, 1);
    setCameraTagReady(false);
    onUpload(medias, uuid);
  });
  

  CameraTag.observe(cameraId, 'countdownStarted', () => {
    reAnimateQuestion()
  });

  CameraTag.observe(cameraId, 'cameraReset', () => {
    setCameraTagReady(true);
    console.timeEnd('someFunction');

    console.log('camera reset ready');
  });
};

const Record = ({ onUpload, name, description, maxLength, reAnimateQuestion }) => {
  const [cameraTagReady, setCameraTagReady] = useState(true);
  let mobile = false;
  const width = () =>
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (width() < 400) mobile = true;

  const height = () =>
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    
  useEffect(() => {
    CameraTag.setup();
    setupObservers(onUpload, setCameraTagReady, reAnimateQuestion);
    return () => {
      CameraTag.cameras[cameraId].destroy();
    };
  }, [onUpload, reAnimateQuestion]);

  const useAsHeight = simple ? height() / 1.5 : height() / 2


  return (
    <div className={styles.wrapper}>
        <camera
          data-name={name}
          data-description={description}
          className={styles.center}
          data-app-id="a-b0419fd0-86f2-0137-a3ff-02f6e3696dde"
          id={cameraId}
          data-sources="record"
          data-pre-roll-length="5"
          data-min-length="0"
          data-maxlength={maxLength || 90}
          data-autopreview="false"
          data-simple-security="true"
          data-height={useAsHeight}
          data-width={mobile ? (useAsHeight) * 0.75 : (useAsHeight) * (4 / 3)}
          data-stack={DetectRTC.osName.toLowerCase() === 'android' ? 'mediarecorder' : 'auto'}
        />
    </div>
  );
};

export default Record;
