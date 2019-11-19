/* global CameraTag */
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import qs from 'qs';

import {
  StartScreen,
  RecordingScreen,
  CountDownScreen,
  WaitScreen,
  CompletedScreen,
  AcceptScreen,
  PlaybackScreen,
  PausedScreen,
  SettingsScreen,
  MobileStartScreen,
  SmsScreen,
  CameraDetectionScreen,
  UploadScreen,
} from './screens';

const DetectRTC = require('detectrtc');

const simple = qs.parse(window.location.search)['simple'];
const cameraId = 'DeepHire';


const useScreenHeight = () => {

function debounce(fn, ms) {
  let timer;
  return _ => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      // eslint-disable-next-line prefer-rest-params
      fn.apply(this, arguments);
    }, ms);
  };
}
  const height = () =>
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const handleResize = () => {
    console.log("resise")
    setCameraHeight(height());
  };
  const [cameraHeight, setCameraHeight] = useState(height());
  useEffect(() => {
    window.addEventListener(
      'resize',
      debounce(() => handleResize(), 500)
    );
    return () => {
      window.removeEventListener(
        'resize',
        debounce(() => handleResize(), 500)
      );
    };
  }, [handleResize]);
  return cameraHeight;
};
const height = () =>
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const setupObservers = (onUpload, setRecording, setUploadProgress) => {
  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {
    const myCamera = CameraTag.cameras[cameraId];
    //set timeout is to fix a bug on edge/ie with event queue (reset does not work without it)
    setTimeout(() => {
      myCamera.reset();
    }, 1);
    onUpload(medias, uuid);
  });

  CameraTag.observe(cameraId, 'recordingStarted', () => {
    setRecording(true);
  });
  CameraTag.observe(cameraId, 'recordingStopped', () => {
    setRecording(false);
  });

  CameraTag.observe(cameraId, 'uploadProgress', percent => {
    setUploadProgress(Math.floor(percent * 100));
  });

  CameraTag.observe(cameraId, 'published', percent => {
    setUploadProgress(0);
  });

  //  CameraTag.observe(cameraId, "initialized", function(){

  // });
};

const Record = ({ onUpload, name, description, maxLength }) => {
  const [recording, setRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const screenHeight = useScreenHeight();
  console.log(screenHeight)
  
  let mobile = false;
  const width = () =>
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (width() < 576) mobile = true;

  const useCameraTagSetup = () =>
    useEffect(() => {
      CameraTag.setup();

      setupObservers(onUpload, setRecording, setUploadProgress);
      return () => {
        CameraTag.cameras[cameraId].destroy();
      };
    }, []);

  useCameraTagSetup();


 

  const useAsHeight = simple === '1' ? screenHeight / 1.5 : screenHeight / 2;

  // handleResize() {
  //   this.setState({ width: getWidth() });
  // }
  // componentDidMount() {
  //   window.addEventListener('resize', debounce(() => this.handleResize(), 500));
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', debounce(() => this.handleResize(), 500));
  // }

  return (
    <div className={styles.wrapper}>
      <camera
      
        data-name={name}
        data-description={description}
        className={styles.center}
        data-app-id='a-b0419fd0-86f2-0137-a3ff-02f6e3696dde'
        id={cameraId}
        data-sources='record'
        data-pre-roll-length='3'
        data-min-length='0'
        data-maxlength={maxLength || 90}
        data-autopreview='false'
        data-simple-security='true'
        data-height={useAsHeight}
        data-width={mobile ? useAsHeight * 0.75 : useAsHeight * (4 / 3)}
        data-stack={DetectRTC.osName.toLowerCase() === 'android' ? 'mediarecorder' : 'auto'}
      ></camera>
      <StartScreen />
      <RecordingScreen maxLength={maxLength} recording={recording} />
      <CountDownScreen />
      <WaitScreen />
      <CompletedScreen />
      <AcceptScreen mobile={mobile} />
      {/* <ErrorScreen /> */}
      <PlaybackScreen />
      <PausedScreen />
      <SettingsScreen />
      <MobileStartScreen />
      <SmsScreen />
      <UploadScreen percent={uploadProgress} />
      <CameraDetectionScreen />
    </div>
  );
};

export default Record;
