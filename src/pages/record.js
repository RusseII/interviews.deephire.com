import practiceQuestions from '@/services/practiceInterviewQuestions';
import React, { useState, useEffect } from 'react';
import { OTSession } from 'opentok-react';

import ReactPlayer from 'react-player';
import { Modal, Spin, Button, Row } from 'antd';
import styles from './record.less';
import qs from 'qs';

import {
  fetchInterview,
  notifyRecruiter,
  notifyCandidate,
  startArchive,
  stopArchive,
  storeInterviewQuestion,
  getCredentials,
  checkVideo,
} from '@/services/api';
import Timer from '@/components/Timer';
import Video from '@/components/Video';
import PreInterviewTest from '@/components/PreInterviewTest';

import { router } from 'umi';

export default ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const fullName = qs.parse(location.search)['fullName'];
  const email = qs.parse(location.search)['email'];
  const p = qs.parse(location.search)['practice'];

  // const [connection, setConnection] = useState('Disconnected');
  const [error, setError] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [connectionDetails, setApi] = useState(null);
  const [practice, setPractice] = useState(p);

  const [realInterviewModal, setRealInterviewModal] = useState(false);

  const [preTestCompleted, setPreTestCompleted] = useState(false);

  const [visible, setVisible] = useState(true);

  const [videoUrl, setVideoUrl] = useState(null);
  const [published, setPublished] = useState(false);

  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const [retakes, setRetakes] = useState(null);
  const [interview, setInterview] = useState({
    key: 0,
    paused: true,
    time: 45,
    countDown: true,
    buttonText: 'Start Recording',
    screen: 'prepare',
  });
  const [action, setAction] = useState('start');

  const [startingData, setStartingData] = useState({ interviewQuestions: [{ question: 'test' }] });

  const { interview_questions: interviewQ = [] } = practiceQuestions;
  const [interviewQuestions, setInterviewQuestions] = useState(interviewQ);

  // for any hooks noobs, passing in [] as 2nd paramater makes useEffect work the same for componenetDidMount
  useEffect(() => {
    setup();
    setAction('start');
    getCredentials().then(session => setApi(session));
  }, []);

  const publisherEventHandlers = {
    accessDenied: () => {
      console.log('User denied access to media source');
    },
    streamCreated: () => {
      console.log('Publisher stream created');
    },
    streamDestroyed: ({ reason }) => {
      console.log(`Publisher stream destroyed because: ${reason}`);
    },
  };

  const onSessionError = error => {
    setError(JSON.stringify(error));
  };

  const onPublish = () => {
    setPublished(true);
    console.log('Publish Success');
  };

  const onPublishError = error => {
    setError(JSON.stringify(error));
  };

  const startRecording = () => {
    startArchive(connectionDetails.sessionId).then(r => console.log(setArchiveId(r.id)));
  };

  const stopRecording = () => {
    stopArchive(archiveId);
  };

  const startRealInterview = () => {
    setPractice(null);
    setInterviewQuestions(startingData.interviewQuestions);
    setIndex(0);
    setRetakes(startingData.retakesAllowed);
    setRealInterviewModal(false);
    prepareScreen(startingData);
  };
  const setup = async () => {
    var [data] = await fetchInterview(id);
    setData(data);
    console.log(data);
    const {
      email: createdBy,
      interviewName,
      interview_config: { answerTime, prepTime, retakesAllowed } = {},
      interview_questions: interviewQ = [],
    } = data || {};

    setStartingData({
      interviewName,
      answerTime,
      prepTime,
      retakesAllowed,
      interviewQuestions: interviewQ,
      createdBy,
    });
    setRetakes(retakesAllowed);
    setInterview({
      ...interview,
      time: prepTime,
    });
  };

  const changeButtonAction = action => {
    switch (action) {
      case 'start':
        return start();

      case 'stop':
        return stop();

      case 'nextQuestion':
        return nextQuestion();

      default:
        return console.log('uh oh case returned default');
    }
  };

  const start = async () => {
    console.log(index, interviewQuestions);
    console.log(startingData.interviewQuestions);
    setVideoUrl(null);
    recordScreen();
    startRecording();
  };

  const prepareScreen = startingData => {
    setInterview({
      key: 0,
      paused: false,
      time: startingData.prepTime,
      countDown: true,
      buttonText: 'Start Recording',
      helperText: 'Prepare your answer',
      screen: 'prepare',
    });
    setAction('start');
  };

  const recordScreen = () => {
    setInterview({
      key: 1,
      time: startingData.answerTime,
      paused: false,
      countDown: false,
      buttonText: 'Stop Recording',
      helperText: 'Recording...',
      screen: 'record',
    });
    setAction('stop');
  };

  const reviewScreen = () => {
    setInterview({
      key: 2,
      time: startingData.prepTime,
      paused: true,
      countDown: true,
      buttonText: 'Next Question',
      review: true,
      helperText: 'Review your video',
      screen: 'review',
    });
    setAction('nextQuestion');
  };

  const nextQuestion = () => {
    if (!practice) {
      storeInterviewQuestion(
        id,
        email,
        fullName,
        email,
        startingData.interviewName,
        interviewQuestions[index].question,
        `https://s3.amazonaws.com/deephire-video-dump/${
          connectionDetails.apiKey
        }/${archiveId}/archive.mp4`
      );
    }
    if (interviewQuestions.length === index + 1) {
      if (practice) {
        setRealInterviewModal(true);
      } else {
        notifyCandidate(fullName, email);
        notifyRecruiter(id, fullName, email, startingData.interviewName, startingData.createdBy);
        router.push('/victory');
      }
    } else {
      setIndex(index + 1);
      prepareScreen(startingData);
    }
  };

  const retake = () => {
    if (retakes > 0) {
      setRetakes(retakes - 1);
      prepareScreen(startingData);
    }
  };

  const stop = async () => {
    stopRecording();
    reviewScreen();
    const url = `https://s3.amazonaws.com/deephire-video-dump/${
      connectionDetails.apiKey
    }/${archiveId}/archive.mp4`;
    setVideoUrl(await checkVideo(url));
  };

  if (!data) return null;
  if (!interview) return null;

  return (
    <div className={styles.wrapper}>
      <div id="sessionStatus">Publish Status: {published ? 'Y' : 'N'}</div>
      {error ? (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      ) : null}
      {practice && (
        <PreInterviewTest setPreTestCompleted={setPreTestCompleted} visible={visible} setVisible={setVisible} />
      )}
      <div style={{ paddingTop: '12px' }}>
        <h1> {interviewQuestions[index].question}</h1>
        {interview.helperText}
      </div>

      <Timer
        key={interview.key}
        reset={true}
        countDown={interview.countDown}
        paused={interview.paused}
        onFinish={() => changeButtonAction(action)}
        seconds={interview.time}
      />

      {connectionDetails && preTestCompleted && (
        <OTSession
          style={{ height: '100%', width: '100%' }}
          {...connectionDetails}
          onError={onSessionError}
          // eventHandlers={sessionEventHandlers}
        >
          <Row style={{ paddingTop: '12px' }} type="flex" justify="center">
            {interview.review && (
              <Spin spinning={!videoUrl}>
                <ReactPlayer
                  controls
                  key={videoUrl}
                  className="OTPublisherContainer"
                  playing={true}
                  playsinline={true}
                  url={videoUrl}
                />
              </Spin>
            )}

            <Video
              screen={interview.screen}
              properties={{
                fitMode: 'contains',
                frameRate: '30',
              }}
              onPublish={onPublish}
              onError={onPublishError}
              eventHandlers={publisherEventHandlers}
            />
          </Row>
        </OTSession>
      )}

      <>
        {interview.review && <Button onClick={retake}>{`Retake (${retakes} left)`}</Button>}
        <Button className={styles.button} onClick={() => changeButtonAction(action)}>
          {interview.buttonText}
        </Button>
        <Modal
          title="Practice Completed."
          visible={realInterviewModal}
          onOk={startRealInterview}
          onCancel={() => setRealInterviewModal(false)}
          okText="Start Your Real Interview!"
          cancelText="Not Yet"
        >
          You're all set for the real interview! Good Luck!
        </Modal>
        ;
      </>
    </div>
  );
};
