/* eslint-disable no-console */
/* global CameraTag */
import React, { useEffect, useState } from 'react';
import styles from './style.less';

const DetectRTC = require('detectrtc');

const cameraId = 'DeepHire';

const setupObservers = (onUpload, setCameraTagReady) => {
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
    <div
      className={styles.wrapper}
      style={{ cursor: 'pointer' }}
      onClick={() =>
        document
          .querySelector(
            ' a.cameratag_primary_link.cameratag_record_link.cameratag_record'
          )
          .click()
      }
    >
      <camera
        data-name={name}
        data-description={description}
        className={styles.center}
        data-app-id="a-b0419fd0-86f2-0137-a3ff-02f6e3696dde"
        id={cameraId}
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
