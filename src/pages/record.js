import data from './temp.js';
import React, { useState } from 'react';

import ReactPlayer from 'react-player';
import { Button, Row, Col } from 'antd';
import styles from './record.less';

import { camerakit } from './assets/camerakit-web.min.js';
import vimeo from './vimeo.js';
import Timer from '@/components/Timer';

let myStream;
export default () => {
  const [before, setBefore] = useState(true);
  const { interview_config: interviewConfig, interview_questions: interviewQuestions } = data.data;
  const { answerTime, prepTime, retakesAllowed } = interviewConfig;
  const [videoUrl, setUrl] = useState();

  const setUrlHack = objectURL => {
    // I have no idea why I have to do this, if i just call setURL directly, the
    // url is not changed and it still renders the mediastream obj
    setUrl('');
    setTimeout(function() {
      setUrl(objectURL);
    }, 1);
  };

  const stop = () => {
    const recordedVideo = myStream.recorder.stop();
    const objectURL = URL.createObjectURL(recordedVideo);
    myStream.destroy();
    setUrlHack(objectURL);
  };

  const start = async () => {
    const devices = await camerakit.getDevices();

    myStream = await camerakit.createCaptureStream({
      audio: devices.audio[0],
      video: devices.video[0],
    });

    myStream.setResolution({ aspect: 16 / 9 });
    myStream.recorder.start();
    const streamUrl = await myStream.getMediaStream();
    setUrl(streamUrl);
  };

  return (
    <div className={styles.normal}>
      <div style={{ paddingTop: '24px' }}>
        {' '}
        <h1>Start Your Practice Interview</h1>{' '}
      </div>
      <Timer countDown={true} paused onFinish={() => console.log('finished')} seconds={prepTime} />
      <br />

      <Row type="flex" justify="center">
        <Col span={15}>
          {before ? (
            <div>
              Welcome to your video Interview. You will be presented 5 different questions, with 40
              seconds to prepare for each question, 90 seconds to answer each question, and 8
              retakes throughout the entire interview. If you have any questins about the
              experience, send me a message on the bottom right.
            </div>
          ) : (
            <div className={styles.playerWrapper}>
              <ReactPlayer
                className={styles.reactPlayer}
                controls
                playing
                url={videoUrl}
                width="100%"
                height="100%"
              />
            </div>
          )}
        </Col>
      </Row>
      {before ? (
        <Button className={styles.button} onClick={() => setBefore(false)}>
          Start Pracice Interview
        </Button>
      ) : (
        <>
          <Button onClick={start}>start</Button>
          <Button onClick={stop}>stop</Button>
        </>
      )}

      {/* <Button onClick={start}>start</Button>
      <Button onClick={stop}>stop</Button> */}
    </div>
  );
};
