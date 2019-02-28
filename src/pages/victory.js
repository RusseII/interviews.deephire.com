import React, { useState } from 'react';

import { Button, Row, Col } from 'antd';
import styles from './record.less';

export default () => {
  return (
    <div className={styles.normal}>
      <div style={{ paddingTop: '24px' }}>
        <h1>Interview Completed!</h1>
        Your Interview has been sent to your recruiter
      </div>

      <br />

      <Row type="flex" justify="center">
        <Col span={15}>
          <div>
            <img
              height="100%"
              width="100%"
              src="https://interview.deephire.com/static/media/trophy.81ebf3a9.gif"
              alt="Prepare to Record!"
            />
          </div>
        </Col>
      </Row>
      <Button className={styles.button}>Leave Feedback</Button>
    </div>
  );
};
