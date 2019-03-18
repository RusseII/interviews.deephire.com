import React, { useState } from 'react';
import styles from './index.less';
import ReactPlayer from 'react-player';
import { Button, Steps, Modal, Row, Col } from 'antd';
import SignIn from '@/components/SignIn';
import qs from 'qs';

const Step = Steps.Step;

const Index = ({ location }) => {
  const pin = qs.parse(location.search)['pin'];

  const downloadiOS = () =>
    window.open('https://itunes.apple.com/us/app/deephire/id1380277628?mt=8', '_blank');
  const openCrisp = () => window.openChat();
  const [iOS, setIOS] = useState(!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

  return (
    <div className={styles.normal}>
      <Modal
        closable={false}
        title="Safari support is experimental, some features may not work correctly"
        visible={iOS}
        onOk={() => setIOS(false)}
        onCancel={() => setIOS(false)}
      >
        {/* <Steps direction="vertical" size="small" current={0}>
          <Step
            title="Download App"
            description={
              <div>
                <Button onClick={downloadiOS} type="secondary">
                  iOS
                </Button>{' '}
              </div>
            }
          />
          <Step
            title="Enter Code"
            description={
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: 'Your interview code is <h3 ><b>' + pin + '</b></h3>',
                }}
              />
            }
          />
          <Step title="Take the interview!" description="Good luck!" />
        </Steps> */}
      </Modal>
      <div style={{ paddingTop: '24px' }}>
        <h1>Welcome to your Video Interview!</h1>{' '}
      </div>

      <Row type="flex" justify="center">
        <Col span={15} xxl={11} xl={12}>
          <div className={styles.playerWrapper}>
            <ReactPlayer
              className={styles.reactPlayer}
              url={'https://vimeo.com/296044829/74bfec15d8'}
              width="100%"
              height="100%"
            />
          </div>
        </Col>
      </Row>
      <SignIn location={location} />
    </div>
  );
};

export default Index;
