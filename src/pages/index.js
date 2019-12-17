/* global mixpanel FS $crisp*/
import SignIn from '@/components/SignIn';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import { Col, Row, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { lowerCaseQueryParams } from '@/services/helpers';

import undrawPhoto from '@/../public/undrawPhoto.png';

import { router } from 'umi';
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
  const [compId, setCompId] = useState(null)
  const { id, fullname: fullNameParam, email: emailParam, simple } = lowerCaseQueryParams(
    location.search
  );

  const getData = async () => {
    let interview = await fetchInterview(id);

    if (interview) {
      interview = interview[0] || interview;
      const { companyId, _id, interviewName, createdBy } = interview;
      setCompId(companyId)
      const url = await fetchCompanyInfo(companyId);
      const { companyName } = url || {};

      mixpanel.set_group('InterviewCompany', [companyName]);
      mixpanel.set_group('InterviewID', [_id]);
      mixpanel.set_group('InterviewName', [interviewName]);
      mixpanel.set_group('CreatedBy', [createdBy]);
      mixpanel.set_group('CompanyId', [companyId]);

      mixpanel.track('Interview visited');
    } else {
      mixpanel.track('Invalid ID');
      router.push('/404');
    }
  };

  const useOnMount = () =>
    useEffect(() => {
      if (emailParam && fullNameParam && id) {
        identify(emailParam, fullNameParam, id);
      }

      getData();
    }, []);

  useOnMount();

  return (
    <div className={styles.normal}>
      {simple !== '1' && (
        <h1 style={{ fontSize: 24, paddingTop: '24px' }}>
          { compId !== dotJobsCompanyId ? 'Welcome! You\'ve been invited for a one-way video interview!': 'Record Your Video Interview'}
        </h1>
      )}
      <Row style={{ paddingTop: 24 }} type="flex" justify="center">
        <Col sm={8} xs={0}>
          <img alt="videoInterview" style={{ width: '100%', maxWidth: 300 }} src={undrawPhoto} />
        </Col>
        <Col sm={16} xs={22} style={{ textAlign: 'left' }}>
          <div>
          {compId !== dotJobsCompanyId ?
            'You will be asked to record answers to a series of prompts that will ask you common interview questions.' :
          'You are about to record your video interview. You will be asked to answer a series of interview questions. '}
          </div>


          {compId === dotJobsCompanyId && thingsToKnow}
          <br />
          <div style={{ fontWeight: 'bold' }}>What you will need:</div>
          <div>- Your phone or a computer with a camera</div>
          <div>- Quiet environment</div>
          <div>- 10-15 minutes </div>

          {compId === dotJobsCompanyId && proTips}
        </Col>
      </Row>

      <Divider />

      <SignIn location={location} skip={fullNameParam && emailParam} />
    </div>
  );
};

export default Index;
