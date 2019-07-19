/* global CameraTag */
import React, { useEffect } from 'react';
import styles from './style.less';
const DetectRTC = require('detectrtc');

const cameraId = 'DeepHire';

const setupObservers = onUpload => {
  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {
    const { mp4, thumb } = medias;
    const myCamera = CameraTag.cameras[cameraId];
    myCamera.reset();
    onUpload(mp4, thumb, uuid);
  });
};

const Record = ({ onUpload, name, description, maxLength }) => {
  let mobile = false;
  const width = () =>
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (width() < 400) mobile = true;
  
  const height = () =>
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  useEffect(() => {
    CameraTag.setup();
    setupObservers(onUpload);
  }, []);

  return (
    <div className={styles.wrapper}>
      <camera
        data-name={name}
        data-description={description}
        className={styles.center}
        data-app-id="a-b0419fd0-86f2-0137-a3ff-02f6e3696dde"
        id={cameraId}
        data-sources="record"
        data-pre-roll-length="3"
        data-min-length="0"
        data-maxlength={ maxLength|| 90}
        data-autopreview="false"
        data-simple-security="true"
        data-height={mobile ? height() / 2 : height() / 2}
        data-width={mobile ? (height() / 2) * 0.75 : (height() / 2) * (4 / 3)}
        data-stack={ DetectRTC.osName === "android" ? "mediarecorder" :'auto'}
      />
    </div>
  );
};

export default Record;
