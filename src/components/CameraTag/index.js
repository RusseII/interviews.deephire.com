/* global CameraTag $crisp */
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import qs from 'qs';
// import { Spin } from 'antd';
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
  UploadScreen, ErrorScreen
} from './screens';

const DetectRTC = require('detectrtc');

// const simple = qs.parse(window.location.search)['simple'];
const cameraId = 'DeepHire';

const logEvent = (event) => {
  $crisp.push(["set", "session:event", [[["video_error", { event: event }, "red"]]]])
  console.log(event)
}

const setupObservers = ({onUpload, setRecording, setUploadProgress, setInitialized, setError, setAudioWarning}) => {

  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {
    setUploadProgress(0);
    const myCamera = CameraTag.cameras[cameraId];
    //set timeout is to fix a bug on edge/ie with event queue (reset does not work without it)
    setTimeout(() => {
      myCamera.reset();
    }, 1);
    onUpload(medias, uuid);
  });

  var maxAudioVolume = 0; 
  // Check the max volume after 5 seconds to diagnose audio issues   
  const detectAudioIssues = () => {
    setTimeout(() => {
      if (maxAudioVolume == 0) {
        logEvent(`No audio`);
        setAudioWarning(`No audio detected! Please check your microphone and retry.`);
      }
    }, 5000);
  }

  CameraTag.observe(cameraId, 'audioLevel', (volume) => {
    // Get the max volume 
    if (volume > maxAudioVolume) maxAudioVolume = volume;
  });

  CameraTag.observe(cameraId, 'recordingStarted', () => {
    CameraTag.cameras[cameraId].showRecorder();
    setRecording(true);
    setAudioWarning(false);
    detectAudioIssues();
  });

  CameraTag.observe(cameraId, 'noMic', () => {
    logEvent('noMic')
  });

  CameraTag.observe(cameraId, 'uploadAborted', (errorDetails) => {
    logEvent('uploadAborted')
  });

  CameraTag.observe(cameraId, 'serverError', () => {
    logEvent('serverError')
  });
  CameraTag.observe(cameraId, 'cameraDenied', () => {
    setError('Camera Permissions Denied')
    logEvent('cameraDenied')
  });

  CameraTag.observe(cameraId, 'hardwareAccessDenied', () => {
    setError('Camera Permissions Denied')
    logEvent('hardwareAccessDenied')
  });

  CameraTag.observe(cameraId, 'micDenied', () => {
    logEvent('micDenied')
  });

  CameraTag.observe(cameraId, 'serverDisconnected', () => {
    logEvent('serverDisconnected')
  });

  CameraTag.observe(cameraId, 'recordingStopped', () => {
    setRecording(false);
    CameraTag.cameras[cameraId].showRecorder(); // To display the recorder's video preview. 
  });

  CameraTag.observe(cameraId, 'playbackStarted', () => {
    setRecording(false);
    CameraTag.cameras[cameraId].showPlayer();
  });

  CameraTag.observe(cameraId, 'uploadProgress', percent => {
    setUploadProgress(Math.floor(percent * 100));
  });

  CameraTag.observe(cameraId, "initialized", function(){
    setInitialized(true)
    // CameraTag.cameras[cameraId].connect();
  })

  CameraTag.observe(cameraId, "cameraReset", function(){
    // CameraTag.cameras[cameraId].connect();
    setInitialized(false)
    setTimeout(() => setInitialized(true), 1000)
  })
};

const Record = ({ onUpload, name, description, maxLength }) => {
  const [recording, setRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [audioWarning, setAudioWarning] = useState(false); 
  const [error, setError] = useState(null)
  

  let mobile = false;
  const width = () =>
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (width() < 576) mobile = true;

  const useCameraTagSetup = () =>
    useEffect(() => {
      CameraTag.setup();

      setupObservers({onUpload, setRecording, setUploadProgress, setInitialized, setError, setAudioWarning});
      return () => {
        CameraTag.cameras[cameraId].destroy();
      };
    }, []);

  useCameraTagSetup();

  return (
    // SPIN was causing an issue on browsers using flash. It did not allow them to click on the button to enable flash. 
    // <Spin spinning={!initialized}>
      <div className={styles.wrapper}>
        {/* <div style={{display: 'inline-block', width: mobile ? useAsHeight * 0.75 : useAsHeight * (4 / 3), height: useAsHeight}}>  */}
        <camera
        className={"testing"}
          data-name={name}
          data-description={description}
       
          data-app-id="a-b0419fd0-86f2-0137-a3ff-02f6e3696dde"
          id={cameraId}
          data-sources="record"
          data-pre-roll-length="3"
          data-min-length="0"
          data-maxlength={maxLength || 90}
          data-autopreview="false"
          data-simple-security="true"
          data-stack={DetectRTC.osName.toLowerCase() === 'android' ? 'mediarecorder' : 'auto'}
        />
        {/* </div> */}
        <StartScreen />
        <RecordingScreen maxLength={maxLength} recording={recording} warning={audioWarning}/>
        <CountDownScreen />
        <WaitScreen />
        <CompletedScreen />
        <AcceptScreen mobile={mobile} />
        <ErrorScreen error={error} />
        <PlaybackScreen />
        <PausedScreen />

        <MobileStartScreen />
        <SmsScreen />
        <UploadScreen percent={uploadProgress} />
        <CameraDetectionScreen />
        <SettingsScreen />
      </div>
    // </Spin>
  );
};

export default Record;
