/* global mixpanel */
import React from 'react';

import SafariWebview from '../SafariWebview';

const DetectRTC = require('detectrtc');

export default props => {
  const { browser } = DetectRTC;

  const iOS =
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;

  switch (DetectRTC && DetectRTC.osName) {
    case 'iOS':
      if (browser.name === 'Safari') {
        if (!DetectRTC.isGetUserMediaSupported) return <SafariWebview />;
      } else if (iOS) {
        // eslint-disable-next-line no-alert
        alert(
          'This Interview will only work in the Safari Browser, please re-open in Safari'
        );
        mixpanel.track('Unsupported iOS browser used');
      }
      break;
    default:
      return props.children;
  }
  return props.children;
};
