/* global CameraTag */
import React, { useEffect } from 'react';
import styles from './style.less';

const cameraId = 'DeepHire';

const setupObservers = onUpload => {
  CameraTag.observe(cameraId, 'published', ({ medias, uuid }) => {
    const { mp4, thumb } = medias;
    console.log('mp4', 'thumb', mp4, thumb);
    const myCamera = CameraTag.cameras[cameraId];
    myCamera.reset();
    onUpload(mp4, thumb, uuid);
  });
};

const Record = ({ onUpload, name, description }) => {
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
        data-maxlength="90"
        data-autopreview="false"
        data-simple-security="true"
      />
    </div>
  );
};

export default Record;
