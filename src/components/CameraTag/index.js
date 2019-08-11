/* eslint-disable no-console */
/* global CameraTag */
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import RecordButton from '@/components/CameraTag/RecordButton';
import styles from './style.less';

const DetectRTC = require('detectrtc');

const cameraId = 'DeepHire';

const setupObservers = (
  onUpload,
  setCameraTagReady,
  setLoaded,
  setCountdownStarted
) => {
  CameraTag.observe(cameraId, 'initialized', () => {
    CameraTag.cameras[cameraId].connect();
  });
  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {
    const myCamera = CameraTag.cameras[cameraId];
    // set timeout is to fix a bug on edge/ie with event queue (reset does not work without it)
    setTimeout(() => {
      myCamera.reset();
    }, 1);
    setCameraTagReady(false);
    onUpload(medias, uuid);
  });

  CameraTag.observe(cameraId, 'initialized', () => {
    setLoaded(true);
  });
  CameraTag.observe(cameraId, 'countdownStarted', () => {
    setCountdownStarted(true);
  });

  CameraTag.observe(cameraId, 'cameraReset', () => {
    setCameraTagReady(true);
    console.timeEnd('someFunction');

    console.log('camera reset ready');
  });
};

const Record = ({ onUpload, name, description, maxLength }) => {
  const [cameraTagReady, setCameraTagReady] = useState(true);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  let mobile = false;
  const width = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (width() < 400) mobile = true;

  const height = () =>
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  useEffect(() => {
    CameraTag.setup();
    setupObservers(onUpload, setCameraTagReady, setLoaded, setCountdownStarted);
    return () => {
      CameraTag.cameras[cameraId].destroy();
    };
  }, []);
  return (
    <div className={styles.wrapper}>
      <RecordButton
        cameraId={cameraId}
        countdownStarted={countdownStarted}
        loaded={loaded}
      />

      <camera
        data-name={name}
        data-description={description}
        className={styles.center}
        data-app-id="a-b0419fd0-86f2-0137-a3ff-02f6e3696dde"
        id={cameraId}
        data-record-on-connect="false"
        data-sources="record"
        data-pre-roll-length="3"
        data-min-length="0"
        data-maxlength={maxLength || 90}
        data-autopreview="false"
        data-simple-security="true"
        data-height={mobile ? height() / 2 : height() / 2}
        data-width={mobile ? (height() / 2) * 0.75 : (height() / 2) * (4 / 3)}
        data-stack={
          DetectRTC.osName.toLowerCase() === 'android'
            ? 'mediarecorder'
            : 'auto'
        }
      />
    </div>
  );
};

export default Record;
