/* global mixpanel */
import PreInterviewTest from '../PreInterviewTest';
import SafariWebview from '../SafariWebview';
const DetectRTC = require('detectrtc');

export default props => {
  const { browser } = DetectRTC;

  switch (DetectRTC && DetectRTC.osName) {
    case 'iOS':
      if (browser.name === 'Safari') {
        if (!DetectRTC.isGetUserMediaSupported) return <SafariWebview />;
      } else {
        alert('This Interview will only work in the Safari Browser, please reopen in Safari');
        mixpanel.track('Unsupported iOS browser used');
      }
      break;
    default:
      return <PreInterviewTest {...props} />;
  }
  return <PreInterviewTest {...props} />;
};
