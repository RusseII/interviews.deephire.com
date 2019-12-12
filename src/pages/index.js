/* global mixpanel FS $crisp*/
import SignIn from '@/components/SignIn';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import { Col, Row, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { lowerCaseQueryParams } from '@/services/helpers';
import { startedEvent } from '@/services/api';

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

const Index = ({ location }) => {
  const { id, fullname: fullNameParam, email: emailParam, simple } = lowerCaseQueryParams(
    location.search
  );
  const [companyInfo, setCompanyInfo] = useState(null);
  const [interviewInfo, setInterviewInfo] = useState(null)

  const executeStartedEvent = async (candidateEmail = emailParam, userName = fullNameParam) => {
    return await startedEvent(candidateEmail, userName, companyInfo._id, interviewInfo.interviewName );
  };
  const getData = async () => {
    let interview = await fetchInterview(id);

    if (interview) {
      interview = interview[0] || interview;
      setInterviewInfo(interview)
      const { companyId, _id, interviewName, createdBy } = interview;
      const info = await fetchCompanyInfo(companyId);
      setCompanyInfo(info);
      const { companyName } = info || {};

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
          Welcome! You've been invited for a one-way video interview!
        </h1>
      )}
      <Row style={{ paddingTop: 24 }} type="flex" justify="center">
        <Col sm={8} xs={0}>
          <img alt="videoInterview" style={{ width: '100%', maxWidth: 300 }} src={undrawPhoto} />
        </Col>
        <Col sm={16} xs={22} style={{ textAlign: 'left' }}>
          <div>
            You will be asked to record answers to a series of prompts that will ask you common
            interview questions.
          </div>
          <br />
          <div style={{ fontWeight: 'bold' }}>You will need:</div>
          <div>- Computer with camera, or a phone.</div>
          <div>- Quiet environment.</div>
          <div>- Approximately 15 minutes.</div>
        </Col>
      </Row>

      <Divider />

      <SignIn executeStartedEvent={executeStartedEvent} location={location} skip={fullNameParam && emailParam} />
    </div>
  );
};

export default Index;
