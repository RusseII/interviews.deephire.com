export default 
  {
    "_id": {
      "$oid": "5c607c60b62fdb0008f5afd0"
    }, 
    "email": "russell@deephire.com", 
    "interviewName": "Sales Interview", 
    "interview_config": {
      "answerTime": 90, 
      "prepTime": 45, 
      "retakesAllowed": 20
    }, 
    "interview_questions": [
      {
        "question": "(Practice) Tell me about yourself."
      }
    
   
      // {
      //   "question": "(Practice) What are your strengths?"
      // }, 
    
    ], 
    "long_url": "https://interview.deephire.com/pickInterview/http%3A%2F%2Fdeeplink.me%2Finterview.deephire.com%2Fhome%3Fid%3D5c607c60b62fdb0008f5afd0%26flow%3Dinterview%26pin%3D85619", 
    "pin": "85619", 
    "python_datetime": "2019-02-10 14:32:48", 
    "short_url": "http://link.deephire.com/2aa9n"
  }



// import data from './temp.js';
// import React, { useState} from 'react';

// import ReactPlayer from 'react-player';
// import { Button, Progress, Row, Col } from 'antd';
// import styles from './index.less';

// import { camerakit } from './assets/browser.min.js';

// let myStream;
// export default () => {
//   const { interview_config: interviewConfig, interview_questions: interviewQuestions } = data.data;
//   const { answerTime, prepTime, retakesAllowed } = interviewConfig;
//   const [videoUrl, setUrl] = useState();
  



//   const [count, setCount] = useState(50);
//   const stop = () => {
//     const recordedVideo = myStream.recorder.stop(); // Use the video yourself
//     const objectURL = URL.createObjectURL(recordedVideo);
//     setUrl(objectURL)
//     // myStream.recorder.downloadLatestRecording(); // Download the video direct from browser

//     // Stop using camera
//     myStream.destroy();

//   };

//   const start = async () => {
//     const devices = await camerakit.getDevices();

//     myStream = await camerakit.createCaptureStream({
//       audio: devices.audio[0],
//       video: devices.video[0],
//     });
    

//     myStream.setResolution({ aspect: 16 / 9 });
//     myStream.recorder.start();
//     const streamUrl = await myStream.getMediaStream();
//     setUrl(streamUrl);

    
//   };

//   const [videoUrl, setUrl] = useState();

//   const finishRecord = () => {
//   const recordedVideo = myStream.recorder.stop(); // Use the video yourself
//   const objectURL = URL.createObjectURL(recordedVideo);
//   setUrl(objectURL)
//   }
//   return (
//       <>
//             {console.log(videoUrl, "videoUrl")}
//              {/* if i print videoUrl it equals something like blob:http://localhost:8000/3434 */}
//              {/* if i paste that url manaually into the url field, it works, but as the videoUrl variable, it does not */}
//             <ReactPlayer url={videoUrl}/>
//        </>
//   );
// };
