import React, { useState } from 'react';

import { Button, Row, Col } from 'antd';
import styles from './record.less';

export default () => {
  return (
    <div className={styles.wrapper}>
      <div style={{ paddingTop: '24px' }}>
        <h1>Interview Completed!</h1>
        Your Interview has been sent to your recruiter
      </div>

      <br />

      <Row type="flex" justify="center">
        <div class="OTPublisherContainer" style={{overflow: "hidden"}}>
          <img style={{ margin:"0 -100%" ,verticalAlign:"middle"}}
          height="100%"
          // width="100%"
            src="https://interview.deephire.com/static/media/trophy.81ebf3a9.gif"
            alt="Prepare to Record!"
          />
        </div>
      </Row>
      <Button type="primary" onClick={window.openChat} className={styles.button}>
        Leave Feedback
      </Button>
    </div>
  );
};
