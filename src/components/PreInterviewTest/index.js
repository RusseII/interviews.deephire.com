import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import React, { useState, useEffect } from 'react';
import { getCredentials } from '@/services/api';
import { Modal, Progress, Icon, Row, Col, Button } from 'antd';

// import styles from './index.less';

const Status = ({ type, color, text }) => (
  <>
    <Row type="flex" justify="center">
      <Icon
        theme="twoTone"
        twoToneColor={color}
        style={{ textAlign: 'center', fontSize: 100 }}
        type={type}
      />
    </Row>
    <Row style={{ paddingTop: '12px' }} type="flex" justify="space-between">
      <Col span={24}>
        <div style={{ textAlign: 'center' }}>{text}</div>
      </Col>
    </Row>
  </>
);

const Results = ({ testResults }) => {
  //ad proptypes

  return (
    <>
      <Row style={{ paddingTop: '24px' }} type="flex" justify="space-between">
        <Col span={8}>
          <Status type="camera" color={testResults.camera ? '#52c41a' : '#ffa39e'} text="Camera" />;
        </Col>
        <Col span={8}>
          <Status
            type="dashboard"
            color={testResults.connection ? '#52c41a' : '#ffa39e'}
            text="Network"
          />
          ;
        </Col>

        <Col span={8}>
          <Status type="audio" color={testResults.audio ? '#52c41a' : '#ffa39e'} text="Audio" />;
        </Col>
      </Row>
    </>
  );
};

const PreInterviewTest = ({ visible, setVisible }) => {
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // the test must have seprate credentials to run correctly
    getCredentials()
      .then(testSession => {
        return testSession;
      })
      .then(testSession => checkSessionConnection(testSession));
  }, []);

  setTimeout(() => {
    if (progress < 100) setProgress(progress + 1);
  }, 1000);

  const checkSessionConnection = testSession => {
    try {
      // eslint-disable-next-line
      var otNetworkTest = new NetworkTest(OT, testSession);
    } catch (error) {
      switch (error.name) {
        case ErrorNames.MISSING_OPENTOK_INSTANCE:
          console.error('Missing OT instance in constructor.');
          break;
        case ErrorNames.INCOMPLETE_SESSON_CREDENTIALS:
        case ErrorNames.MISSING_SESSON_CREDENTIALS:
        case ErrorNames.INVALID_SESSON_CREDENTIALS:
          console.error('Missing or invalid OpenTok session credentials.');
          break;
        default:
          console.error('Unknown error .');
      }
    }
    otNetworkTest
      .testConnectivity()
      .then(results => {
        console.log('OpenTok connectivity test results', results);
        // setTestResults({ ...testResults, connection: results.success });
        let c = results.success;

        otNetworkTest
          .testQuality(function updateCallback(stats) {
            console.log('intermediate testQuality stats', stats);
          })
          .then(results => {
            // This function is called when the quality test is completed.
            console.log('OpenTok quality results', results);
            const result = {
              audio: results.audio.supported,
              camera: results.video.supported,
              connection: c,
            };
            setTestResults({ ...testResults, ...result });
            setProgress(100)
            let publisherSettings = {};
            if (results.video.reason) {
              console.log('Video not supported:', results.video.reason);
              publisherSettings.videoSource = null; // audio-only
            } else {
              publisherSettings.frameRate = results.video.recommendedFrameRate;
              publisherSettings.resolution = results.video.recommendedResolution;
            }
            if (!results.audio.supported) {
              console.log('Audio not supported:', results.audio.reason);
              publisherSettings.audioSource = null;
              // video-only, but you probably don't want this -- notify the user?
            }
            if (!publisherSettings.videoSource && !publisherSettings.audioSource) {
              // Do not publish. Notify the user.
            } else {
              // Publish to the "real" session, using the publisherSettings object.
            }
          })
          .catch(error => {
            console.log('OpenTok quality test error', error);
          });
      })
      .catch(function(error) {
        console.log('OpenTok connectivity test error', error);
      });
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleError = () => {
    console.log('call openchat');
    window.openChat();
  };

  const successFooter = [
    <Button key="Take Interview" type="primary" onClick={handleOk}>
      Take Interview
    </Button>,
  ];

  const failureFooter = [
    <Button key="Take Interview" type="danger" onClick={handleError}>
      Error: Contact Support
    </Button>,
  ];

  return (
    <div>
      <Modal
        visible={visible}
        title="Check Network/Camera/Audio"
        footer={
          !Object.keys(testResults).length
            ? null
            : testResults.audio && testResults.camera && testResults.connection
            ? successFooter
            : failureFooter
        }
      >
        <Progress percent={progress} />
        <Results testResults={testResults} />
      </Modal>
    </div>
  );
};

export default PreInterviewTest;
