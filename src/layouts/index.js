/* global mixpanel $crisp */
import styles from './index.less';
import { Layout, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { lowerCaseQueryParams } from '@/services/helpers';
import { fetchInterview, fetchCompanyInfo } from '@/services/api';
import { router } from 'umi';
const { Footer, Content, Header } = Layout;

const defaultInterviewValue = {
  interview: null,
  company: null,
};
export const CompleteInterviewDataContext = React.createContext(defaultInterviewValue);

const BasicLayout = ({ children, location }) => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Loading...',
    logo:
      'http://atelier.swiftideas.com/union-demo/wp-content/uploads/sites/5/2014/05/unionproducts-img-blank.png',
  });

  const [completeInterviewData, setComplateInterviewInfo] = useState({
    interviewData: null,
    companyData: null,
  });

  const { id, simple } = lowerCaseQueryParams(location.search);

  const getData = async () => {
    let interviewData = await fetchInterview(id);

    if (interviewData) {
      interviewData = interviewData[0] || interviewData;
      // setInterviewInfo(interviewData)
      const { companyId, companyName, createdBy, _id, interviewName } = interviewData;

      const info = await fetchCompanyInfo(companyId);
      setComplateInterviewInfo({interviewData, companyData: info})
      setCompanyInfo(info);
      $crisp.push([
        'set',
        'session:data',
        [
          ['createdBy', createdBy],
          ['companyId', companyId],
        ],
      ]);
      $crisp.push([
        'set',
        'user:company',
        [
          companyId,
          { description: `Job Seeker. Interview createdBy: ${createdBy}, ${companyName}` },
        ],
      ]);

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
  
    
  }

  useEffect(getData, []);

  return (
    <Layout>
      <CompleteInterviewDataContext.Provider value={completeInterviewData}>
        {simple !== '1' && (
          <Header className={styles.header}>
            <Row type="flex" justify="space-between">
              <Col>{companyInfo.companyName || 'DeepHire'}</Col>
              <Col>
                <img
                  src={companyInfo.logo || 'https://s3.amazonaws.com/deephire/dh_vertical.png'}
                  alt={companyInfo.companyName}
                  className={styles.logo}
                />
              </Col>
            </Row>
          </Header>
        )}

        <Content className={simple === '1' ? styles.simpleContent : styles.content}>
          {children}
        </Content>
        {simple !== '1' && (
          <Footer className={styles.footer}>Powered by DeepHire | Find your fit.</Footer>
        )}
      </CompleteInterviewDataContext.Provider>
    </Layout>
  );
};

export default BasicLayout;
