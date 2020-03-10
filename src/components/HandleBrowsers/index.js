/* global mixpanel */
import SafariWebview from '../SafariWebview';
const DetectRTC = require('detectrtc');

export default props => {
  const { browser } = DetectRTC;
 
  if  (DetectRTC?.browser?.isEdge) {
      alert('We are currently having issues with the the Microsoft Edge browser. Please use Google Chrome or Firefox instead for your interview.')
      mixpanel.track('Edge Browser Used');
  }
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
      return props.children;
  }
  return props.children;
};
