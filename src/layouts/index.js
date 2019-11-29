/* global $crisp */
import styles from './index.less';
import { Layout, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { lowerCaseQueryParams } from '@/services/helpers';
import { fetchInterview, fetchCompanyInfo } from '@/services/api';

const { Footer, Content, Header } = Layout;
const BasicLayout = ({ children, location }) => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Loading...',
    logo:
      'http://atelier.swiftideas.com/union-demo/wp-content/uploads/sites/5/2014/05/unionproducts-img-blank.png',
  });

  const { id, simple } = lowerCaseQueryParams(location.search);

  useEffect(() => {
    fetchInterview(id).then(r => {
      if (r[0]) {
        const { companyId, createdBy, companyName } = r[0];
        fetchCompanyInfo(companyId).then(r => setCompanyInfo(r || {}));
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
      }
    });
  }, [id]);

  return (
    <Layout>
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
    </Layout>
  );
};

export default BasicLayout;
