import React, { Component } from 'react';
import styles from './index.less';
import ReactPlayer from 'react-player';
import { Row, Col } from 'antd';
import SignIn from '@/components/SignIn';

const Index = ({location}) => (
  <div className={styles.normal}>
    <div style={{ paddingTop: '24px' }}>
      <h1>Welcome to your Video Interview!</h1>{' '}
    </div>

    <Row type="flex" justify="center">
      <Col span={15} xxl={11} xl={12}> 
        <div className={styles.playerWrapper}>
          <ReactPlayer
            className={styles.reactPlayer}
            url={'https://vimeo.com/296044829/74bfec15d8'}
            width="100%"
            height="100%"
          />
        </div>
      </Col>
    </Row>
    <SignIn location={location}/>
  </div>
);

export default Index;
