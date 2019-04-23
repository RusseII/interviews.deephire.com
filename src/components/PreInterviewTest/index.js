import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import React, { useState, useEffect } from 'react';
import { getCredentials } from '@/services/api';
import { Alert, Spin, Modal, Progress, Icon, Row, Col, Button } from 'antd';

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

const Results = ({ testResults: { camera, connection, audio } }) => {
  const color = {
    undefined: 'grey',
    success: '#52c41a',
    warning: '#ffe58f',
    failure: '#ffa39e',
  };

  return (
    <>
      <Row style={{ paddingTop: '24px' }} type="flex" justify="space-between">
        <Col span={8}>
          <Status type="camera" color={color[camera]} text="Camera" />
        </Col>
        <Col span={8}>
          <Status type="dashboard" color={color[connection]} text="Network" />
        </Col>

        <Col span={8}>
          <Status type="audio" color={color[audio]} text="Audio" />
        </Col>
      </Row>
      <div style={{ paddingTop: '24px' }}>
        {connection === 'warning' && (
          <Alert
            message="Slow Network"
            description="Network Speed determined to be slow, if you record your video may be of lower quality -
          you can still take the interview now, or find a better connection then take it."
            type="warning"
            showIcon
          />
        )}
        {connection === 'failure' && (
          <Alert
            message="Connection Error"
            description="There was a problem uploading from your device"
            type="error"
            showIcon
          />
        )}
        {connection === 'success' && audio === 'failure' && camera === 'success' && (
          <Alert
            message="Audio Error"
            description="There was a problem connecting to your audio device"
            type="error"
            showIcon
          />
        )}
        {connection === 'success' && audio === 'success' && camera === 'failure' && (
          <Alert
            message="Camera Error"
            description="There was a problem connecting to your camera"
            type="error"
            showIcon
          />
        )}
        {connection === 'success' && audio === 'success' && camera === 'success' && (
          <Alert
            message="Success!"
            description="All tests completed succesfully, good luck!"
            type="success"
            showIcon
          />
        )}
      </div>
    </>
  );
};

const PreInterviewTest = ({ visible, setVisible }) => {
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState({});

  const runTest = () => {
    getCredentials()
      .then(testSession => {
        return testSession;
      })
      .then(testSession => checkSessionConnection(testSession));
  };
  useEffect(() => {
    // the test must have seprate credentials to run correctly
    runTest();
  }, []);

  let counter = 20;
  const testConnection = async nT => {
    const connectionResults = await nT.testConnectivity();
    console.log('OpenTok connectivity test connectionResults', connectionResults);
    if (connectionResults.failedTests[0]) {
      const result = {
        audio: 'failure',
        camera: 'failure',
        connection: 'failure',
      };
      setTestResults(result);
      setProgress(100);
    } else {
      setProgress(20);
    }
    return connectionResults.success;
  };

  const testQuality = async (nT, network) => {
    const qualityResults = await nT
      .testQuality(stats => {
        console.log('stats', stats);
        if (counter < 86) {
          setProgress((counter += 13));
        }
      })
      .catch(error => {
        console.log(error);
        switch (error.name) {
          case ErrorNames.UNSUPPORTED_BROWSER:
            // Display UI message about unsupported browser
            break;
          case ErrorNames.CONNECT_TO_SESSION_NETWORK_ERROR:
            // Display UI message about network error
            break;
          case ErrorNames.FAILED_TO_OBTAIN_MEDIA_DEVICES:
            // Display UI message about granting access to the microphone and camera
            break;
          case ErrorNames.NO_AUDIO_CAPTURE_DEVICES:
          case ErrorNames.NO_VIDEO_CAPTURE_DEVICES:
            // Display UI message about no available camera or microphone
            break;
          default:
            console.error('Unknown error .');
        }
      });

    // This function is called when the quality test is completed.
    console.log('OpenTok quality qualityResults', qualityResults);

    let result;
    if (qualityResults.video.reason === 'Bandwidth too low.') {
      result = {
        audio: qualityResults.audio.supported ? 'success' : 'failure',
        camera: 'success',
        connection: 'warning',
      };
    } else {
      result = {
        audio: qualityResults.audio.supported ? 'success' : 'failure',
        camera: qualityResults.video.supported ? 'success' : 'failure',
        connection: network ? 'success' : 'failure',
      };
    }
    setTestResults(result);
    setProgress(100);

    if (!qualityResults.audio.supported) {
      console.log('Audio not supported:', qualityResults.audio.reason);
    }
  };

  const checkSessionConnection = async testSession => {
    try {
      // eslint-disable-next-line
      var otNetworkTest = new NetworkTest(OT, testSession, { timeout: 5000 });
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

    const network = await testConnection(otNetworkTest);
    await testQuality(otNetworkTest, network);
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

  const reload = () => {
    // window.location.reload();
    window.open(window.location.href, '_self');
  };
  const failureFooter = [
    <Button key="retake" type="info" onClick={reload}>
      Retake
    </Button>,
    <Button key="Take Interview" type="danger" onClick={handleError}>
      Contact Support
    </Button>,
  ];

  const warningFooter = [
    <Button key="retake" type="info" onClick={reload}>
      Retake
    </Button>,
    <Button key="Take Interview" type="primary" onClick={handleOk}>
      Take Interview
    </Button>,
  ];
  const whichFooter = testResults => {
    const { audio, camera, connection } = testResults;
    if (camera === undefined || connection === undefined || audio === undefined) return null;
    if (camera === 'failure' || connection === 'failure' || audio === 'failure')
      return failureFooter;

    if (camera === 'success' && connection === 'warning' && audio === 'success')
      return warningFooter;
    if (camera === 'success' && connection === 'success' && audio === 'success')
      return successFooter;
    return null;
  };
  return (
    <div>
      <Modal
        closable={false}
        visible={visible}
        title="Setting up device"
        footer={whichFooter(testResults)}
      >
        <Progress percent={progress} />
        <Spin spinning={progress < 100}>
          <Results testResults={testResults} />
        </Spin>
        <div style={{ paddingTop: '24px' }}>
          Once you start, you will be given 1 practice interview question, after that your real
          interview will start.
        </div>
      </Modal>
    </div>
  );
};

export default PreInterviewTest;
