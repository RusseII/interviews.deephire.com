import React, { Component } from 'react';
import styles from './index.css';
import ReactPlayer from 'react-player'
import {Icon, Button, Row, Col} from "antd"
import { camerakit } from './assets/camerakit-web.min.js';
let myStream;


class Index extends Component {
  state = {}
  componentDidMount() {
    // cam();
  }

  start = async () => {
    const devices = await camerakit.getDevices();

    myStream = await camerakit.createCaptureStream({
      audio: devices.audio[0],
      video: devices.video[0]
    });
    console.log(myStream.recorder)
    // myStream.recorder.setMimeType()
  
    myStream.setResolution({aspect: 16/9});
    myStream.recorder.start();
    const streamUrl = myStream.getMediaStream()
    this.setState({streamUrl})


  }

  stop = () => {
    const recordedVideo = myStream.recorder.stop(); // Use the video yourself
    const objectURL = URL.createObjectURL(recordedVideo);
    
    this.setState({recordedVideo, objectURL})
    myStream.recorder.downloadLatestRecording(); // Download the video direct from browser

    // Stop using camera
    myStream.destroy();
  }

  render() {
    const {recordedVideo, objectURL, streamUrl} = this.state
    console.log(recordedVideo, objectURL, streamUrl)

    return (
      <div className={styles.normal}>
      <div style={{  paddingTop: "1.8em"
}}> <h1>Welcome to your Video Interview!</h1> </div>
     
      <Row type="flex" justify="center">

        <Col span={15}  >

        <div className={styles.playerWrapper}>
        <ReactPlayer
                   className={styles.reactPlayer}

                   url={streamUrl ? streamUrl : "https://vimeo.com/296044829/74bfec15d8"}
                   width='100%'
          height='100%'
          playing
        />
        </div>
        </Col>
      </Row>
      
      
      <Row style={{padding: "20px"}}>
   {/* <Icon theme="twoTone" type="video-camera" twoToneColor="#eb2f96"/> */}
        <Button style={{margin: "20px"}}onClick={this.start}>start</Button>
        <Button onClick={this.stop}>stop</Button>
      
        </Row>

      </div>
    );
  }
}

export default Index;