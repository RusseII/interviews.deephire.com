/* eslint-disable no-console */
/* global CameraTag */
import React, { useEffect, useState } from 'react';
import styles from './style.less';

const DetectRTC = require('detectrtc');

const cameraId = 'DeepHire';

const setupObservers = (onUpload, setCameraTagReady) => {
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

  CameraTag.observe(cameraId, 'cameraReset', () => {
    setCameraTagReady(true);
    console.timeEnd('someFunction');

    console.log('camera reset ready');
  });
};

const Record = ({ onUpload, name, description, maxLength }) => {
  const [cameraTagReady, setCameraTagReady] = useState(true);
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
    setupObservers(onUpload, setCameraTagReady);
    return () => {
      CameraTag.cameras[cameraId].destroy();
    };
  }, []);
  return (
    <div className={styles.wrapper}>
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          WebkitBoxPack: 'end',
          justifyContent: 'flex-end',
          WebkitBoxAlign: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          height: '380px',
          animation: '0.3s ease-in-out 0s 1 normal none running ievwDh',
          padding: '0px 24px 68px'
        }}
      >
        <div
          style={{
            fontFamily:
              '"Apercu Pro", apercu-pro, Arial, "Helvetica Neue", Helvetica, sans-serif',
            fontWeight: '500',
            fontSize: '18px',
            color: 'rgb(255, 255, 255)',
            marginBottom: '24px',
            textAlign: 'center',
            textShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 20px'
          }}
        >
          <span>
            Hit{' '}
            <strong
              style={{
                color: 'rgb(227, 73, 28)'
              }}
            >
              RECORD
            </strong>{' '}
            to start!
          </span>
        </div>
        <button
          onClick={e => {
            e.preventDefault();
            CameraTag.cameras[cameraId].record();
          }}
          style={{
            backgroundColor: 'rgba(227, 73, 28, .8)',
            borderRadius: '50%',
            borderStyle: 'none',
            boxShadow: 'rgba(0, 0, 0, .1) 0 10px 30px 0',
            cursor: 'pointer',
            height: '96px',
            outline: 'none',
            padding: '0',
            transitionDelay: '0s',
            transitionDuration: '.1s',
            transitionProperty: 'all',
            transitionTimingFunction: 'ease-in-out',
            width: '96px'
          }}
          className="ixYAQg"
        />
        <div className="common-components__SupportPrompt-y60bw1-14 hMAexU">
          <span aria-labelledby="selfie" role="img">
            😉&nbsp;
          </span>
          Don't worry! you can practice before sending.
        </div>
      </div>
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
