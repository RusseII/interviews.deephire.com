import PreInterviewTest from '../PreInterviewTest';
import SafariWebview from '../SafariWebview';
const { detect } = require('detect-browser');
var DetectRTC = require('detectrtc');

export default props => {
  const browser = detect();
  // eslint-disable-next-line
  //   alert(JSON.stringify(browser));
  switch (browser && browser.name) {
    case 'ios':
      if (DetectRTC.hasWebcam === false) {
        return <SafariWebview />;
      }
      return <PreInterviewTest {...props} />;
    default:
      return <PreInterviewTest {...props} />;
  }
};
