import data from './temp.js';
import React, { useEffect, useState, useReducer, useRef} from 'react';

import ReactPlayer from 'react-player';
import { Button, Progress, Row, Col } from 'antd';
import styles from './index.less';

import { camerakit } from './assets/camerakit-web.min.js';

let myStream;
export default () => {
  const { interview_config: interviewConfig, interview_questions: interviewQuestions } = data.data;
  const { answerTime, prepTime, retakesAllowed } = interviewConfig;
  const [videoUrl, setUrl] = useState();
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }

const setUrlHack = (objectURL) => {
    // I have no idea why I have to do this, if i just call setURL directly, the
    // url is not changed and it still renders the mediastream obj
setUrl("")
setTimeout(function(){    setUrl(objectURL)
}, 1);

}



  const [count, setCount] = useState(50);
  const stop = () => {
    const recordedVideo = myStream.recorder.stop(); // Use the video yourself
    const objectURL = URL.createObjectURL(recordedVideo);
    // myStream.recorder.downloadLatestRecording(); // Download the video direct from browser

    // Stop using camera
    myStream.destroy();
    setUrlHack(objectURL)


  };

  const start = async () => {
    const devices = await camerakit.getDevices();

    myStream = await camerakit.createCaptureStream({
      audio: devices.audio[0],
      video: devices.video[0],
    });
    

    myStream.setResolution({ aspect: 16 / 9 });
    
    this.player && this.player.setVolume(0);
    
    myStream.recorder.start();
    const streamUrl = await myStream.getMediaStream();
    setUrl(streamUrl);
    
  };

  return (
    <div className={styles.normal}>
      <div style={{ paddingTop: '24px' }}>
        {' '}
        <h1>Start Your Practice Interview</h1>{' '}
      </div>

      <Row type="flex" justify="center">
        <Col span={15}>
          <div className={styles.playerWrapper}>
          {console.log(videoUrl, "videoUrl")}
            <ReactPlayer 
            ref={ (ref) => { this.player = ref;} } className={styles.reactPlayer} controls playing url={videoUrl} width="100%" height="100%" />
          </div>
        </Col>
      </Row>
      <Progress type="circle" status="exception" format={percent => percent} percent={count} />
      <Button onClick={start}>start</Button>
      <Button onClick={stop}>stop</Button>
      <Button onClick={onclick}>rend</Button>

    </div>
  );
};
