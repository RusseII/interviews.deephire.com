import PreInterviewTest from '../PreInterviewTest';
import SafariWebview from '../SafariWebview';
var DetectRTC = require('detectrtc');

export default props => {
  const { browser } = DetectRTC;

  switch (DetectRTC && DetectRTC.osName) {
    case 'iOS':
      if (browser.name === 'Safari') {
        if (!DetectRTC.isGetUserMediaSupported) return <SafariWebview />;
      }
      break
    default:
      return <PreInterviewTest {...props} />;
  }
  return <PreInterviewTest {...props} />;
};
