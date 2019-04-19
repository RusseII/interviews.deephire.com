import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import React, { useState, useEffect } from 'react';
import { getCredentials } from '@/services/api';
import { Spin, Modal, Progress, Icon, Row, Col, Button } from 'antd';

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
  console.log('TR', testResults);
  //ad proptypes

  return (
    <>
      <Row style={{ paddingTop: '24px' }} type="flex" justify="space-between">
        <Col span={8}>
          <Status
            type="camera"
            color={
              !Object.keys(testResults).length ? 'grey' : testResults.camera ? '#52c41a' : '#ffa39e'
            }
            text="Camera"
          />
        </Col>
        <Col span={8}>
          <Status
            type="dashboard"
            color={
              !Object.keys(testResults).length ? 'grey' : testResults.connection ? '#52c41a' : '#ffa39e'
            }
            text="Network"
          />
        </Col>

        <Col span={8}>
          <Status
            type="audio"
            color={
              !Object.keys(testResults).length ? 'grey' : testResults.audio ? '#52c41a' : '#ffa39e'
            }
            text="Audio"
          />
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

  let counter = 0;
  const testConnection = async nT => {
    const connectionResults = await nT.testConnectivity();
    console.log('OpenTok connectivity test connectionResults', connectionResults);
    if (connectionResults.failedTests[0]) {
      const result = {
        audio: false,
        camera: false,
        connection: false,
      };
      setTestResults(result);
      setProgress(100);
    }
    return connectionResults.success;
  };

  const testQuality = async (nT, network) => {
    const qualityResults = await nT
      .testQuality(stats => {
        console.log('intermediate testQuality stats', stats);
        setProgress((counter += 20));
      })
      .catch(err => console.log(err));
    // This function is called when the quality test is completed.
    console.log('OpenTok quality qualityResults', qualityResults);
    const result = {
      audio: qualityResults.audio.supported,
      camera: qualityResults.video.supported,
      connection: network,
    };
    setTestResults(result);
    setProgress(100);
    if (qualityResults.video.reason) {
      console.log('Video not supported:', qualityResults.video.reason);
    }

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

  const failureFooter = [
    <Button key="Take Interview" type="danger" onClick={handleError}>
      Error: Contact Support
    </Button>,
  ];

  return (
    <div>
      <Modal
        visible={visible}
        title="Setting up device"
        footer={
          !Object.keys(testResults).length
            ? null
            : testResults.audio && testResults.camera && testResults.connection
            ? successFooter
            : failureFooter
        }
      >
        <Progress percent={progress} />
        <Spin spinning={progress < 100}>
          <Results testResults={testResults} />
        </Spin>
      </Modal>
    </div>
  );
};

export default PreInterviewTest;
