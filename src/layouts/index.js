/* global mixpanel $crisp */
import styles from './index.less';
import { Layout, Row, Col, Alert } from 'antd';
import React, { useEffect } from 'react';
import { router } from 'umi';
import * as Sentry from '@sentry/browser';
import { useCompany, useInterview } from '../services/apiHooks';
const { Footer, Content, Header } = Layout;
const DetectRTC = require('detectrtc');

Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });

const defaultInterviewValue = {
  interview: null,
  company: null,
};
export const CompleteInterviewDataContext = React.createContext(defaultInterviewValue);

const BasicLayout = ({ children }) => {
  let pageBranding;


  const { data: interviewData, isError: isInterviewError } = useInterview();

  const { data: companyData, isError: isCompanyError } = useCompany(interviewData?.companyId);

  const recruiterCompany = interviewData?.recruiterCompany;

  if (companyData?.brands && recruiterCompany) {
    pageBranding = companyData.brands[recruiterCompany];
  }

  const completeInterviewData = { interviewData, companyData: companyData };

  useEffect(() => {
    if (isCompanyError || isInterviewError) {
      mixpanel.track('Invalid ID');
      router.push('/404');
    }

    if (interviewData) {
      const { companyId, companyName, createdBy, _id, interviewName } = interviewData;

      $crisp.push(['set', 'chat:hide', 'session:data', [['createdBy', createdBy], ['companyId', companyId]]]);
      $crisp.push([
        'set',
        'user:company',
        'chat:hide',
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
    }
  }, [companyData, interviewData, isCompanyError, isInterviewError]);

  return (
    <Layout>
      {DetectRTC?.browser?.isEdge && (
        <Alert
          type="error"
          style={{ textAlign: 'center' }}
          message="We are currently having issues with people's microphones on the Microsoft Edge browser. Please use Google Chrome or Firefox instead for your interview."
          banner
        />
      )}
      <CompleteInterviewDataContext.Provider value={completeInterviewData}>
        {(
          <Header className={styles.header}>
            <Row type="flex" justify="space-between">
              <Col>{pageBranding?.name || companyData?.companyName || 'DeepHire'}</Col>
              <Col>
                <img
                  src={
                    pageBranding?.logo ||
                    companyData?.logo ||
                    'https://s3.amazonaws.com/deephire/dh_vertical.png'
                  }
                  alt={pageBranding?.name || companyData?.companyName}
                  className={styles.logo}
                />
              </Col>
            </Row>
          </Header>
        )}

        <Content className={styles.content}>
          {children}
        </Content>
        {<Footer className={styles.footer}>Powered by DeepHire | Find your fit.</Footer>}
      </CompleteInterviewDataContext.Provider>
    </Layout>
  );
};

export default BasicLayout;
