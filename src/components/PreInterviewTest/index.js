import { getCredentials } from '@/services/api';
import { Alert, Button, Col, Icon, Modal, Progress, Row, Spin } from 'antd';
import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import React, { useEffect, useState } from 'react';

// import styles from './index.less';

const showErr = event => {
  window.showError();
  window.setEvent(event);
};

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
            description="Network speed determined to be slow. If you record, your video may be of lower quality. You can still take the interview now or find a better connection before starting."
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
            description="There was a problem connecting to your microphone"
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

const PreInterviewTest = ({ setSupported, setPreTestCompleted, visible, setVisible }) => {
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) showErr(error);
  }, [error]);

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
      setError({ connectionResults: JSON.stringify(connectionResults, null, 2) });
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
        setError({ error: JSON.stringify(error, null, 2) });
        console.log(error);
        switch (error.name) {
          case ErrorNames.UNSUPPORTED_BROWSER:
            setSupported(false)
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
    const { audio = {}, video = {} } = qualityResults;
    if (video.reason === 'Bandwidth too low.') {
      result = {
        audio: audio.supported ? 'success' : 'failure',
        camera: 'success',
        connection: 'warning',
      };
    } else {
      result = {
        audio: audio.supported ? 'success' : 'failure',
        camera: video.supported ? 'success' : 'failure',
        connection: network ? 'success' : 'failure',
      };
      console.log(qualityResults);

      if (!video.supported || !audio.supported)
        setError({ qualityResults: JSON.stringify(qualityResults, null, 2) });
    }

    setTestResults(result);
    setProgress(100);

    if (!audio.supported) {
      console.log('Audio not supported:', audio.reason);
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
    setPreTestCompleted(true);
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
          Once you start, you will be given one practice interview question. After that, your real
          interview will start.
        </div>
      </Modal>
    </div>
  );
};

export default PreInterviewTest;
