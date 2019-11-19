/* global mixpanel FS $crisp*/
import SignIn from '@/components/SignIn';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import { Col, Row, Divider } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import exitIntent from '@/services/exit-intent';
import undrawPhoto from '@/../public/undrawPhoto.png';

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
  FS.identify(email, {
    displayName: fullName,
    email,
  });
  $crisp.push(['set', 'user:email', email]);
  $crisp.push(['set', 'user:nickname', [fullName]]);
};

let removeExitIntent;
const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const emailParms = qs.parse(location.search)['fullname'];
  const fullNameParams = qs.parse(location.search)['email'];
  const simple = qs.parse(location.search)['simple'];
  const chatbox = qs.parse(location.search)['chat'];

  if (chatbox === '0') $crisp.push(["do", "chat:hide"])

  const [url, setUrl] = useState(null);
  const [exitIntentModal, setExitIntentModal] = useState(false);

  const getData = async () => {
    const defaultIntroVideo = 'https://vimeo.com/348346561/29e3914964';
    let interview = await fetchInterview(id);

    if (interview) {
      interview = interview[0] || interview;
      const { companyId, _id, interviewName, createdBy } = interview;
      const url = await fetchCompanyInfo(companyId);
      const { introVideo: companyIntro, companyName } = url || {};
      setUrl(companyIntro ? companyIntro : defaultIntroVideo);
      mixpanel.set_group('InterviewCompany', [companyName]);
      mixpanel.set_group('InterviewID', [_id]);
      mixpanel.set_group('InterviewName', [interviewName]);
      mixpanel.set_group('CreatedBy', [createdBy]);
      mixpanel.set_group('CompanyId', [companyId]);

      mixpanel.track('Interview visited');
    } else {
      mixpanel.track('Invalid ID');
      router.push('/404');
      setUrl(defaultIntroVideo);
    }
  };

  const useOnMount = () =>
    useEffect(() => {
      if (emailParms && fullNameParams && id) {
        identify(emailParms, fullNameParams, id);
      }
      setTimeout(
        () =>
          (removeExitIntent = exitIntent({
            maxDisplays: 1,
            onExitIntent: () => {
              setExitIntentModal(true);
            },
          })),
        5000
      );

      getData();
    }, []);

  useOnMount();

  const exit = e => {
    mixpanel.track(`Exit modal clicked ${e}`);

    setExitIntentModal(false);
  };
  return (
    <div className={styles.normal}>
      {/* <Modal
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
      </Modal> */}
      {simple !== '1' && (
        <h1 style={{ fontSize: 24, paddingTop: '24px' }}>
          Welcome! You've been invited for a one-way video interview!
        </h1>
      )}
      <Row style={{paddingTop: 24}}type="flex" justify="center">
        <Col sm={8} xs={0}>
          <img style={{ width: "100%", maxWidth: 300 }} src={undrawPhoto} />
        </Col>
        <Col sm={16} xs={22}>
          <div style={{ textAlign: 'left' }}>
            You will be asked to record answers to a series of prompts that will ask you common
            interview questions.
          </div>
          <br/>
          <div style={{ textAlign: 'left', fontWeight: "bold" }}>You will need:</div>
          <div style={{ textAlign: 'left' }}>- Computer with camera, or a phone.</div>
          <div style={{ textAlign: 'left' }}>- Quiet environment.</div>
          <div style={{ textAlign: 'left' }}>- Approximately 15 minutes.</div>

        </Col>
      </Row>
  
      <Divider />
      <h1 style={{fontSize: 20}}>Fill out the below info to get started!</h1>
      <SignIn
        text="Next"
        removeExitIntent={
          removeExitIntent ? removeExitIntent : () => console.log('exit intent not setup yet')
        }
        location={location}
      />
    </div>
  );
};

export default Index;
