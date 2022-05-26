
import { Button, Row, Typography } from 'antd';
import React from 'react';
import { lowerCaseQueryParams } from '@/services/helpers.js';
import { router } from 'umi';

import styles from './victory.less';

import ReactPlayer from 'react-player'
const { Title } = Typography;

export default ({location}) => {
  
  return (
    <div className={styles.wrapper}>
      <div >
        <Title level={4}>Please listen to the instructional video below.</Title>
        
      </div>

      <br />

      <Row type="flex" justify="center">
        <div className="OTPublisherContainer">
          <ReactPlayer
          controls
            width="100%"
            height="100%"
            url="https://s3.amazonaws.com/deephire-video-dump/46307922/e9521b8b-4e32-4f31-8777-cf37b75bfb0f/archive.mp4"
            
          />
        </div>
      </Row>

      {/* <Button type="primary" onClick={} className={styles.button}>
          Back
        </Button> */}
        <Button type="primary" onClick={() => router.push(`record${location.search}`)} className={styles.button}>
          Next
        </Button>
    
    </div>
  );
};
