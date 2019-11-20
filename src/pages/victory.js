/* global mixpanel $crisp */

import { openChat } from '@/services/crisp';
import { Button, Row } from 'antd';
import React from 'react';
import qs from 'qs';
import styles from './victory.less';

export default () => {

  const chatbox = qs.parse(window.location.search)['chat'];

  if (chatbox === '0') $crisp.push(["do", "chat:hide"])
  return (
    <div className={styles.wrapper}>
      <div style={{ paddingTop: '24px' }}>
        <h1>Interview Completed!</h1>
        Your Interview has been successfully submitted
      </div>

      <br />

      <Row type="flex" justify="center">
        <div className="OTPublisherContainer" style={{ overflow: 'hidden' }}>
          <img
            style={{ margin: '0 -100%', verticalAlign: 'middle' }}
            height="100%"
            src="https://deephire.s3.amazonaws.com/logos/trophy.gif"
            alt="Prepare to Record!"
          />
        </div>
      </Row>
      { (chatbox !== '0') && <Button type="primary" onClick={openChat} className={styles.button}>
        Leave Feedback
      </Button>
}
    </div>
  );
};
