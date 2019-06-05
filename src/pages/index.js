/* global mixpanel */
import SignIn from '@/components/SignIn';
import { fetchCompanyInfo, fetchInterview } from '@/services/api';
import conditionalLogicForOneClient from '@/technicalDebt/conditionalLogic';
import { Col, Row, Upload } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { router } from 'umi';
import styles from './index.less';

const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const [url, setUrl] = useState(null);

  const getData = async () => {
    const defaultIntroVideo = 'https://vimeo.com/337638606/0468e0b64d';
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
    getData();
  }, []);

  return (
    <div className={styles.normal}>
      <h1 style={{ paddingTop: '24px' }}>Welcome to your Video Interview!</h1>{' '}
      <Row type="flex" justify="center">
        <Col span={15} xxl={11} xl={12}>
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
      <SignIn location={location} />
    </div>
  );
};

export default Index;
