import { Layout, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import qs from 'qs';
import styles from './index.less';
import { fetchInterview, fetchCompanyInfo } from '@/services/api';

const { Footer, Content, Header } = Layout;
const BasicLayout = ({ children, location }) => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Loading...',
    logo:
      'https://atelier.swiftideas.com/union-demo/wp-content/uploads/sites/5/2014/05/unionproducts-img-blank.png'
  });
  const id = qs.parse(location.search)['?id'];

  useEffect(() => {
    if (!id) {
      setCompanyInfo({});
    } else {
      fetchInterview(id).then(r => {
        if (r && r[0]) {
          const { createdBy } = r[0];
          fetchCompanyInfo(createdBy).then(r => setCompanyInfo(r || {}));
        }
      });
    }
  }, []);

  return (
    <Layout>
      <Header className={styles.header}>
        <Row type="flex" justify="space-between">
          <Col>{companyInfo.companyName || 'DeepHire'}</Col>
          <Col>
            <img
              src={
                companyInfo.logo ||
                'https://s3.amazonaws.com/deephire/dh_vertical.png'
              }
              alt={companyInfo.companyName}
              className={styles.logo}
            />
          </Col>
        </Row>
      </Header>

      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>
        Powered by DeepHire | Find your fit.
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
