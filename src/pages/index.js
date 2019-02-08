import React, { Component } from 'react';
import styles from './index.css';

import { camerakit } from './assets/camerakit-web.min.js';
let myStream;

async function cam () {
  const devices = await camerakit.getDevices();
  console.log(devices);

  myStream = await camerakit.createCaptureStream({
    audio: devices.audio[0],
    video: devices.video[0]
  });

  myStream.setResolution({width: 300, height: 300});
}

class Index extends Component {
  componentDidMount() {
    cam();
  }

  start = () => {
    console.log("start");
    myStream.recorder.start();
  }

  stop = () => {
    const recordedVideo = myStream.recorder.stop(); // Use the video yourself

    myStream.recorder.downloadLatestRecording(); // Download the video direct from browser

    // Stop using camera
    myStream.destroy();
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />

        <div onClick={this.start}>start</div>
        <div onClick={this.stop}>stop</div>

        <ul className={styles.list}>
          <li>To get whatever started, edit <code>src/pages/index.js</code> and save to reload.</li>
          <li><a href="https://umijs.org/guide/getting-started.html">Getting Started</a></li>
        </ul>
      </div>
    );
  }
}

export default Index;