import styles from './index.less';
import { Layout, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { fetchInterview, fetchCompanyInfo } from '@/services/api';


const { Footer, Content, Header } = Layout;
const BasicLayout = ({ children, location }) => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Loading...',
    logo:
      'http://atelier.swiftideas.com/union-demo/wp-content/uploads/sites/5/2014/05/unionproducts-img-blank.png',
  });
  const id = qs.parse(location.search)['?id'];
  const simple = qs.parse(location.search)['simple'];


  useEffect(() => {
    fetchInterview(id).then(r => {
      if (r[0]) {
        const { createdBy } = r[0];
        fetchCompanyInfo(createdBy).then(r => setCompanyInfo(r || {}));
      }
    });
  }, [id]);

  return (
    <Layout>

      {simple !== '1'  && 
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
      </Header> }

      <Content className={simple === '1' ? styles.simpleContent : styles.content}>{children}</Content>
      {simple !== '1'  && 
<Footer className={styles.footer}>Powered by DeepHire | Find your fit.</Footer>}
    </Layout>
  );
};

export default BasicLayout;
