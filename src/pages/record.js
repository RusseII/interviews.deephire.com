import data from './temp.js';
import React, { useState, useEffect } from 'react';

import ReactPlayer from 'react-player';
import { Button, Row, Col } from 'antd';
import styles from './record.less';
import qs from 'qs';


import { camerakit } from './assets/camerakit-web.min.js';
import {fetchInterview} from '@/services/api'
// import vimeo from './vimeo.js';
import Timer from '@/components/Timer';
import { router } from 'umi';

let myStream;
export default ({location}) => {

  // const [data, setData] = useState(fetchInterview(id));
  const [before, setBefore] = useState(true);
  const { interview_config: interviewConfig, interview_questions: interviewQuestions } = data.data;
  const { answerTime, prepTime, retakesAllowed } = interviewConfig;
  const [retakes, setRetakes] = useState(retakesAllowed);
  const [index, setIndex] = useState(0);
  const [videoUrl, setUrl] = useState('https://www.youtube.com/watch?v=zORQDzbb2Mg');

  const [interview, setInterview] = useState({
    key: 0,
    paused: true,
    time: prepTime,
    countDown: true,
    buttonText: 'Start Recording',
  });
  const prepareScreen = () => {
    setInterview({
      key: 0,
      paused: false,
      time: prepTime,
      countDown: true,
      buttonText: 'Start Recording',
    });
    setButtonAction(() => () => start());
    setUrl('https://www.youtube.com/watch?v=zORQDzbb2Mg');
  };

  const recordScreen = () => {
    setInterview({
      key: 1,
      time: answerTime,
      paused: false,
      countDown: false,
      buttonText: 'Stop Recording',
    });
    setButtonAction((index) => (index) => stop(index));
  };
  const reviewScreen = (index) => {
    setInterview({
      key: 2,
      time: prepTime,
      paused: true,
      countDown: true,
      buttonText: 'Next Question',
      review: true,
    });
    setButtonAction((index) => (index) => nextQuestion(index));
  };

  const nextQuestion = (index) => {
    prepareScreen();
    if (interviewQuestions.length === index + 1) {
      router.push('/victory');
    } else {
      setIndex(index + 1);

    }
  };

  const retake = () => {
    if (retakes > 0) {
      setRetakes(retakes - 1);
      prepareScreen();
    }
  };

  const start = async () => {
    recordScreen();

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

  const [buttonAction, setButtonAction] = useState(() => () => start());

  const stop = (index) => {
    const recordedVideo = myStream.recorder.stop();
    const objectURL = URL.createObjectURL(recordedVideo);
    myStream.destroy();
    setUrl(objectURL);

    reviewScreen(index);
  };

  if (!interview) return null;

  return (
    <div className={styles.normal}>
      <div style={{ paddingTop: '24px' }}>
        <h1> {interviewQuestions[index].question}</h1>{' '}
        Review your video
      </div>
      <Timer
        key={interview.key}
        reset={true}
        countDown={interview.countDown}
        paused={interview.paused}
        onFinish={() => console.log('finished')}
        seconds={interview.time}
      />
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
            {(interview.key ===0) ? 
              <img
                height="100%"
                width="100%"
                className={styles.reactPlayer}
                src="http://www.geekersmagazine.com/wp-content/uploads/2010/04/resoluci-n-visor...eo-copia-2a16122.png"
                alt="Prepare to Record!"
              /> :

              <ReactPlayer
                key={videoUrl}
                className={styles.reactPlayer}
                playing
                muted
                url={videoUrl}
                width="100%"
                                height="100%"

                
              />
          }
            </div>
          )}
        </Col>
      </Row>
      {before ? (
        <Button
          className={styles.button}
          onClick={() => {
            setBefore(false);
            setInterview({ ...interview, paused: false });
          }}
        >
          Start Pracice Interview
        </Button>
      ) : (
        <>
          {interview.review && <Button onClick={retake}>{`Retake (${retakes} left)`}</Button>}
          <Button className={styles.button} onClick={() => buttonAction(index)}>
            {interview.buttonText}
          </Button>
        </>
      )}

      {/* <Button onClick={start}>start</Button>
      <Button onClick={stop}>stop</Button> */}
    </div>
  );
};
