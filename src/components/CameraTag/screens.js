import React, { useEffect, useState, useRef } from 'react';
import styles from './style.less';
import { Button, Radio, Icon, Statistic, Spin, Progress, Row, Col } from 'antd';
import Timer from '@/components/Timer';


const cameraId = 'DeepHire';

export const StartScreen = () => (
  <div className={styles.tester} id={`${cameraId}-start-screen`}>
    <Button
      className='cameratag_settings_btn'
      style={{ position: 'absolute', right: 0, top: 0, margin: 5 }}
      size='small'
      shape='circle'
      icon='setting'
    />

    <Button
      type='danger'
      ghost={false}
      className='cameratag_record'
      shape='round'
      size={'large'}
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Icon theme='filled' spin={false} type='camera' />
      Record Answer
    </Button>
  </div>
);

export const RecordingScreen = ({ maxLength, recording }) => {

  return (
    <div className={styles.tester} id={`${cameraId}-recording-screen`}>
     {recording && <Timer
      
        style={{ position: 'absolute', right: 0, margin: 10 }}
        seconds={maxLength}
      ></Timer>}
      {/* <div className="cameratag_record_timer_prompt"/> */}
      <Button
        type='danger'
        ghost={false}
        className='cameratag_stop_recording'
        shape='round'
        size={'large'}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Icon theme='filled' spin={true} type='stop' />
        Stop Recording
      </Button>
    </div>
  );
};

export const CountDownScreen = () => (
  <div className={styles.tester} id={`${cameraId}-countdown-screen`}>
           <Row align="middle" type="flex" style={{height: "100%", backgroundColor: 'rgba(0,0,0,.1)' }}>
      <Col style={{ marginTop: 0, fontSize: 100 }} className={'cameratag_countdown_status'} span={24}>
     
      </Col>
      <Col span={24}>
      Recording in...
      </Col>
     </Row>
 
     
    
    
  </div>
);

export const WaitScreen = () => <div className={styles.tester} id={`${cameraId}-wait-screen`}></div>;

export const CompletedScreen = () => (
  <div className={styles.tester} id={`${cameraId}-completed-screen`}></div>
);

// export const ErrorScreen = () => (
//   <div className={styles.tester} id={`${cameraId}-error-screen`}>
//   </div>
// );

export const AcceptScreen = ({mobile}) => (
  <div className={styles.tester} id={`${cameraId}-accept-screen`}>
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.8)' }}>
      <Button
        type='danger'
        className='cameratag_record'
        shape='round'
        size={'large'}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: 'white',
        }}
      >
       { !mobile &&  <Icon type='redo' /> }
         Retake
      </Button>

      <Button
        type='primary'
        className='cameratag_publish'
        shape='round'
        size={'large'}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
      >
        Submit
        { !mobile &&  <Icon type='check' />}
      </Button>
      <div className='cameratag_play' style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <Icon
          style={{
            fontSize: 64,
            left: '50%',
            top: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
          }}
          theme='filled'
          type='play-circle'
        />
      </div>
    </div>
  </div>
);

export const SettingsScreen = () => (
  <div className={styles.tester} id={`${cameraId}-settings-screen`}>
      <div style={{height: "100%", width: "100%", backgroundColor: 'red'}}/>
  </div>
);

export const PausedScreen = () => (
  <div className={styles.tester} id={`${cameraId}-paused-screen`}>
  </div>
);

export const PlaybackScreen = () => (
      <div className={styles.tester} id={`${cameraId}-accept-screen`}>
    <div  className="cameratag_stop_playback" style={{ width: '100%', height: '100%'}}>
    
    </div>
  </div>
);

export const MobileStartScreen = () => (
  <div className={styles.tester} id={`${cameraId}-mobile-start-screen`}>
  </div>
);

export const SmsScreen = () => (
  <div className={styles.tester} id={`${cameraId}-sms-screen`}>
  </div>
);

export const UploadScreen = ({percent}) => (
  <div className={styles.tester} id={`${cameraId}-upload-screen`}>
      <Row align="middle" type="flex" style={{color: "white", height: "100%", backgroundColor: 'rgba(0,0,0,.9)' }}>
      <Col span={24}>
      <Progress  format={(percent) => <div style={{color: "white"}}>{`${percent}%`}</div>} type="circle" percent={percent} />
      </Col>
      <Col span={24}>
      Uploading...
      </Col>
     </Row>
  </div>
);

export const CameraDetectionScreen = () => (
  <div className={styles.tester} id={`${cameraId}-camera-detection-screen`}>
  </div>
);
