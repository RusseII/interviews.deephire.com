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

const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const emailParms = qs.parse(location.search)['fullname'];
  const fullNameParams = qs.parse(location.search)['email'];
  const simple = qs.parse(location.search)['simple'];
  const chatbox = qs.parse(location.search)['chat'];

  if (chatbox === '0') $crisp.push(['do', 'chat:hide']);

  const getData = async () => {
    let interview = await fetchInterview(id);

    if (interview) {
      interview = interview[0] || interview;
      const { companyId, _id, interviewName, createdBy } = interview;
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
      if (emailParms && fullNameParams && id) {
        identify(emailParms, fullNameParams, id);
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
        <Col sm={16} xs={22} style={{textAlign: 'left'}}>
          <div>
            You will be asked to record answers to a series of prompts that will ask you common
            interview questions.
          </div>
          <br />
          <div style={{fontWeight: 'bold' }}>You will need:</div>
          <div>- Computer with camera, or a phone.</div>
          <div>- Quiet environment.</div>
          <div>- Approximately 15 minutes.</div>
        </Col>
      </Row>

      <Divider />
      <h1 style={{ fontSize: 20 }}>Fill out the below info to get started!</h1>
      <SignIn
        text="Next"
        location={location}
      />
    </div>
  );
};

export default Index;
