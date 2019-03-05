import React, { useState } from 'react';

import { Button, Row, Col } from 'antd';
import styles from './record.less';
import qs from "qs"
import { router } from 'umi';


export default ({location}) => {
  const id = qs.parse(location.search)['?id'];
  const fullName = qs.parse(location.search)['fullName'];
  const email = qs.parse(location.search)['email'];

  const startInterview = () => {
    router.push(`/record?id=${id}&fullName=${fullName}&email=${email}`)

    
  }
  return (
    <div className={styles.normal}>
      <div style={{ paddingTop: '24px' }}>
        <h1>Practice Completed</h1>
        Are you ready to start your real interview?

      </div>

      <br />

      <Row type="flex" justify="center">
        <Col span={15}>
          <div>
            <img
              height="100%"
              width="100%"
              // width="100%"
              src="https://s3.amazonaws.com/deephire/logos/undrawInterview.png"
              alt="Prepare to Record!"
            />
          </div>
        </Col>
      </Row>
      <Button onClick={startInterview} className={styles.button}>Start Real Interview</Button>
    </div>
  );
};
