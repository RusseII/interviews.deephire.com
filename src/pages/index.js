/* global mixpanel FS */
import { Col, Row, Upload, Modal, Button } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { router } from 'umi';
import exitIntent from '@/services/exit-intent';

import conditionalLogicForOneClient from '@/technicalDebt/conditionalLogic';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import SignIn from '@/components/SignIn';
import styles from './index.less';

const identify = (email, fullName, id) => {
  mixpanel.alias(email);
  mixpanel.people.set({
    $email: email,
    $last_login: new Date(),
    $name: fullName,
    id,
    interviewStage: 'visited'
  });
  FS.identify(id, {
    displayName: fullName,
    email
  });
};

let removeExitIntent;
const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const emailParms = qs.parse(location.search).fullname;
  const fullNameParams = qs.parse(location.search).email;

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
      setUrl(companyIntro || defaultIntroVideo);
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
    removeExitIntent = exitIntent({
      maxDisplays: 1,
      onExitIntent: () => {
        setExitIntentModal(true);
      }
    });
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
    <div style={{ height: '100%' }} className={styles.normal}>
      <Modal
        title="Are you sure you want to leave?"
        onCancel={() => exit('Stay')}
        visible={exitIntentModal}
        footer={
          <Button size="large" type="primary" onClick={() => exit('Stay')}>
            Close
          </Button>
        }
      >
        This interview is a chance to show off what makes you unique. If you're
        having a problem, please message our support team.
      </Modal>
      <Row style={{ height: '100%' }}>
        <Col span={12} style={{ height: '100%' }}>
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
        </Col>
        <Col span={12}>
          <Row type="flex" justify="center">
            {/* YUCK - Conditional logic for 1 client (below) */}
            {id === '5c93849154b7ba00088dde51' && (
              <Upload {...conditionalLogicForOneClient} />
            )}
            {/* YUCK - Conditional logic for 1 client (above) */}
          </Row>
          <SignIn
            text="Start Interview"
            subText="10 minutes or less"
            removeExitIntent={removeExitIntent}
            location={location}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Index;
