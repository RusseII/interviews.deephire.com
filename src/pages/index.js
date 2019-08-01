/* global mixpanel FS*/
import SignIn from '@/components/SignIn';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import conditionalLogicForOneClient from '@/technicalDebt/conditionalLogic';
import { Col, Row, Upload, Modal } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import exitIntent from '@/services/exit-intent';

import { router } from 'umi';
import styles from './index.less';

const identify = (email, fullName, id) => {
  mixpanel.alias(email);
  mixpanel.people.set({
    $email: email,
    $last_login: new Date(),
    $name: fullName,
    id,
    interviewStage: 'visited',
  });
  FS.identify(id, {
    displayName: fullName,
    email,
  });
};

let removeExitIntent;
const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const emailParms = qs.parse(location.search)['fullname'];
  const fullNameParams = qs.parse(location.search)['email'];

  const [url, setUrl] = useState(null);
  const [exitIntentModal, setExitIntentModal] = useState(false);

  const getData = async () => {
    const defaultIntroVideo = 'https://vimeo.com/348346561/29e3914964';
    let interview = await fetchInterview(id);

    if (interview) {
      interview = interview[0] || interview;
      const { createdBy, _id, interviewName } = interview;
      const url = await fetchCompanyInfo(createdBy);
      const { introVideo: companyIntro, companyName } = url || {};
      setUrl(companyIntro ? companyIntro : defaultIntroVideo);
      mixpanel.set_group('InterviewCompany', [companyName]);
      mixpanel.set_group('Interview', [_id, interviewName]);
      mixpanel.track('Interview visited');
    } else {
      mixpanel.track('Invalid ID');
      router.push('/404');
      setUrl(defaultIntroVideo);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      removeExitIntent = exitIntent({
      maxDisplays: 1,
      onExitIntent: () => {
        setExitIntentModal(true);
      },
    });
  }, 5000)

    if (emailParms && fullNameParams && id) {
      identify(emailParms, fullNameParams, id);
    }
    getData();
  }, []);

  const exit = e => {
    mixpanel.track(`Exit modal clicked ${e}`);

    setExitIntentModal(false);
  };
  return (
    <div className={styles.normal}>
      <Modal
        title="Are you sure you want to leave?"
        visible={exitIntentModal}
        // onOk={handleOk}e
        cancelText="Leave"
        okText="Stay"
        onOk={() => exit('Stay')}
        onCancel={() => exit('Leave')}
      >
        This intervew is a chance to show off what makes you unique. Please complete it now, or
        message our support if you have issues!
        {/* <SignIn metaData="Exit Intent Modal" text="Save" removeExitIntent={removeExitIntent} location={location} /> */}
      </Modal>
      <h1 style={{ paddingTop: '24px' }}>Welcome to your Video Interview!</h1>{' '}
      <Row type="flex" justify="center">
        <Col xxl={8} xl={8} lg={8} md={8} xs={8} sm={15}>
          <div className={styles.playerWrapper}>
            <ReactPlayer
              onStart={() => mixpanel.track('Watched intro video')}
              onEnded={() => mixpanel.track('Watched full intro video')}
              controls
              key={url}
              className={styles.reactPlayer}
              url={url}
              width="100%"
              height="100%"
            />
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        {/* YUCK - Conditional logic for 1 client (below) */}
        {id === '5c93849154b7ba00088dde51' && <Upload {...conditionalLogicForOneClient} />}
        {/* YUCK - Conditional logic for 1 client (above) */}
      </Row>
      <SignIn
        text="Start Interview (10 minutes)"
        removeExitIntent={removeExitIntent}
        location={location}
      />
    </div>
  );
};

export default Index;
