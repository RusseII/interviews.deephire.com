import practiceQuestions from '@/services/practiceInterviewQuestions';
import React, { useState, useEffect } from 'react';
import { OTSession } from 'opentok-react';

import LoadingScreen from 'react-loading-screen';

import ReactPlayer from 'react-player';
import { Timeline, Button, Row, Col } from 'antd';
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
} from '@/services/api';
import Timer from '@/components/Timer';
import Video from '@/components/Video';
import PreInterviewTest from '@/components/PreInterviewTest';

import { router } from 'umi';

export default ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const fullName = qs.parse(location.search)['fullName'];
  const email = qs.parse(location.search)['email'];
  const practice = qs.parse(location.search)['practice'];

  const [connection, setConnection] = useState('Disconnected');
  const [error, setError] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [connectionDetails, setApi] = useState(null);
  const [visible, setVisible] = useState(true);

  const [before, setBefore] = useState(true);

  const [videoUrl, setVideoUrl] = useState(null);
  const [k, setK] = useState(0);
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

  // for any hooks noobs, passing in [] as 2nd paramater makes useEffect work the same for componenetDidMount
  useEffect(() => {
    if (!practice) setBefore(false);
    setup();
    setAction('start');
    getCredentials().then(session => setApi(session));
  }, []);

  const sessionEventHandlers = {
    sessionConnected: () => {
      setConnection('Connected');
      console.log('w');
    },
    sessionDisconnected: () => {
      setConnection('Disconnected');
    },
    sessionReconnected: () => {
      setConnection('Reconnected');
    },
    sessionReconnecting: () => {
      setConnection('Reconnecting');
    },
  };

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
    startArchive(connectionDetails.sessionId)
      .then(r => r.json())
      .then(r => console.log(setArchiveId(r.id)));
  };

  const stopRecording = () => {
    stopArchive(archiveId);
  };

  const setup = async () => {
    var [data] = await fetchInterview(id);
    if (practice) data = practiceQuestions;
    setData(data);
    const {
      email: createdBy,
      interviewName,
      interview_config: { answerTime, prepTime, retakesAllowed } = {},
      interview_questions: interviewQuestions = [],
    } = data || {};
    setStartingData({
      interviewName,
      answerTime,
      prepTime,
      retakesAllowed,
      interviewQuestions,
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
    prepareScreen(startingData);

    if (!practice) {
      storeInterviewQuestion(
        id,
        email,
        fullName,
        email,
        startingData.interviewName,
        startingData.interviewQuestions[index].question,
        `https://s3.amazonaws.com/deephire-video-dump/${
          connectionDetails.apiKey
        }/${archiveId}/archive.mp4`
      );
    }
    if (startingData.interviewQuestions.length === index + 1) {
      if (practice) router.push(`/real?id=${id}&fullName=${fullName}&email=${email}`);
      else {
        notifyCandidate(fullName, email);
        notifyRecruiter(id, fullName, email, startingData.interviewName, startingData.createdBy);
        router.push('/victory');
      }
    } else {
      setIndex(index + 1);
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

    setVideoUrl(
      `https://s3.amazonaws.com/deephire-video-dump/${
        connectionDetails.apiKey
      }/${archiveId}/archive.mp4`
    );
    setK(10);
  };

  if (!data) return null;
  if (!interview) return null;

  return (
    <div className={styles.wrapper}>
      {/* <div id="sessionStatus">Session Status: {connection}</div> */}
      {error ? (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      ) : null}
      {practice && <PreInterviewTest  visible={visible} setVisible={setVisible} />}
      <div style={{ paddingTop: '24px' }}>
        <h1> {before ? 'Whats Next' : startingData.interviewQuestions[index].question}</h1>{' '}
        {interview.helperText}
      </div>
      {!before && (
        <Timer
          key={interview.key}
          reset={true}
          countDown={interview.countDown}
          paused={interview.paused}
          onFinish={() => changeButtonAction(action)}
          seconds={interview.time}
        />
      )}
      <br />
      {connectionDetails && (
        <OTSession
          {...connectionDetails}
          // apiKey={apiKey}
          // sessionId={sessionId}
          // token={token}
          onError={onSessionError}
          eventHandlers={sessionEventHandlers}
        >
          <Row type="flex" justify="center">
            <Col span={15}>
              {before ? (
                <>
                  <h3>{`You’ll be taken to a Practice Interview (2 Questions) so you can get used to the system. After you finish the Practice Interview, there is a break and then your real interview will begin! Good luck! `}</h3>
                  <br /> <br />
                  <h4>Each questions follows the following format:</h4>
                  <br />
                  <br />
                  <Timeline mode="alternate">
                    <Timeline.Item>{`${startingData.prepTime} Seconds to Prepare`}</Timeline.Item>
                    <Timeline.Item color="blue">{`${
                      startingData.answerTime
                    } Seconds to Record`}</Timeline.Item>
                    <Timeline.Item color="red">Review Video Answer</Timeline.Item>
                  </Timeline>
                </>
              ) : (
                <div>
                  {/* <button id="record" onClick={archive}>
                    Record
        </button>
                  <button id="stop" onClick={stopArchive}>
                    STOP
        </button> */}

                  {interview.review && (
                    <ReactPlayer
                      key={k}
                      onError={err =>
                        setTimeout(() => {
                          console.log(err);
                          if (err.type) setK(k + 1);
                        }, 1000)
                      }
                      controls
                      // className={styles.reactPlayer}
                      playing={true}
                      playsinline={true}
                      url={videoUrl}
                      width="100%"
                      height="100%"
                    />
                  )}

                  <LoadingScreen
                    loading={!published}
                    bgColor="#f1f1f1"
                    spinnerColor="#9ee5f8"
                    textColor="#676767"
                    text="Connecting to Camera..."
                  />
                  <Video
                    screen={interview.screen}
                    properties={{
                      fitMode: 'contains',
                      frameRate: '30',
                      height: '33.75vw',
                      width: '60vw',
                    }}
                    onPublish={onPublish}
                    onError={onPublishError}
                    eventHandlers={publisherEventHandlers}
                  />
                </div>
              )}
            </Col>
          </Row>
        </OTSession>
      )}
      {before ? (
        <Button
          className={styles.button}
          onClick={() => {
            setBefore(false);

            setInterview({ ...interview, helperText: 'Prepare your answer', paused: false });
          }}
        >
          Start Practice Interview
        </Button>
      ) : (
        <>
          {interview.review && <Button onClick={retake}>{`Retake (${retakes} left)`}</Button>}
          <Button className={styles.button} onClick={() => changeButtonAction(action)}>
            {interview.buttonText}
          </Button>
        </>
      )}
    </div>
  );
};
