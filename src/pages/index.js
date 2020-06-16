/* global mixpanel FS $crisp*/
import SignIn from '@/components/SignIn';
import { Col, Row, Divider } from 'antd';
import React, { useEffect, useContext } from 'react';
import { lowerCaseQueryParams } from '@/services/helpers';
import { startedEvent, clickedEvent } from '@/services/api';
import { CompleteInterviewDataContext } from '@/layouts'

import undrawPhoto from '@/../public/undrawPhoto.png';


import styles from './index.less';

const dotJobsCompanyId = '5d35e2acfc5e3205581b573d';

const thingsToKnow = (
  <>
    {' '}
    <br />
    <div style={{ fontWeight: 'bold' }}>Things to know:</div>
    <div>- Your initial video interview will consist of 5 questions</div>
    <div>- These questions represent what would be asked on a first interview</div>
    <div>- You have the ability to re-record answers if you make a mistake </div>
    <div>- You MUST complete all questions for your interview to be uploaded</div>
    <div>
      - Your answers will not be saved if you leave the interview before answering all questions{' '}
    </div>
  </>
);

const proTips = (
  <>
    <br />
    <div style={{ fontWeight: 'bold' }}>Pro-tips:</div>
    <div>- Dress appropriately. Dress the way you would for an in person interview</div>
    <div>- Remove clutter from the background</div>
    <div>- Answer questions completely and honestly</div>
    <div>- Be confident. You are going to do great</div>
    <br />
    After your interview is complete you will have the ability to watch your interview responses and
    manage your recordings.
    <br />
  </>
);

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

const Index = ({ location }) => {
  const completeInterviewData = useContext(CompleteInterviewDataContext)
  const companyId = completeInterviewData?.companyData?._id
  const interviewName = completeInterviewData.interviewData?.interviewName
  const { id, fullname: fullNameParam, email: emailParam, simple } = lowerCaseQueryParams(
    location.search
  );

  const executeStartedEvent = async (candidateEmail = emailParam, userName = fullNameParam) => {
    return await startedEvent(candidateEmail, userName, companyId, interviewName, completeInterviewData );
  };
  const executeClickedEvent = (candidateEmail, userName) => {
    return clickedEvent(candidateEmail, userName, companyId, interviewName, completeInterviewData );
  };

  const useOnMount = () =>
    useEffect(() => {
      if (emailParam && fullNameParam && id) {
        executeClickedEvent(emailParam, fullNameParam)
        identify(emailParam, fullNameParam, id);
      }
    }, []);

  useOnMount();

  return (
    <div className={styles.normal}>
      {simple !== '1' && (
        <h1 style={{ fontSize: 24, paddingTop: '24px' }}>
          { companyId !== dotJobsCompanyId ? 'Welcome! You\'ve been invited to complete a video introduction!': 'Record Your Video Interview'}
        </h1>
      )}
      <Row style={{ paddingTop: 24 }} type="flex" justify="center">
        <Col sm={8} xs={0}>
          <img alt="videoInterview" style={{ width: '100%', maxWidth: 300 }} src={undrawPhoto} />
        </Col>
        <Col sm={16} xs={22} style={{ textAlign: 'left' }}>
          <div>
          {companyId !== dotJobsCompanyId ?
            'You will be asked to record answers to a series of prompts that will ask you common interview questions.' :
          'You are about to record your video interview. You will be asked to answer a series of interview questions. '}
          </div>


          {companyId === dotJobsCompanyId && thingsToKnow}
          <br />
          <div style={{ fontWeight: 'bold' }}>What you will need:</div>
          <div>- Your phone or a computer with a camera</div>
          <div>- Quiet environment</div>
          <div>- 10-15 minutes </div>

          {companyId === dotJobsCompanyId && proTips}
        </Col>
      </Row>

      <Divider />

      <SignIn executeStartedEvent={executeStartedEvent} companyId={companyId} location={location} skip={fullNameParam && emailParam} />
    </div>
  );
};

export default Index;
