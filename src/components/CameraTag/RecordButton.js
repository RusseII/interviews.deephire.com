/* global CameraTag */
import React from 'react';

const RecordButton = ({ cameraId }) => (
  <div
    style={{
      zIndex: '9992229',
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      WebkitBoxPack: 'end',
      justifyContent: 'flex-end',
      WebkitBoxAlign: 'center',
      alignItems: 'center',
      height: '380px',
      animation: '0.3s ease-in-out 0s 1 normal none running',
      padding: '0px 24px 68px'
    }}
  >
    <div
      style={{
        fontWeight: '500',
        fontSize: '18px',
        color: 'rgb(255, 255, 255)',
        marginBottom: '24px',
        textAlign: 'center',
        textShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 20px'
      }}
    >
      <span>
        Hit{' '}
        <strong
          style={{
            color: 'rgb(227, 73, 28)'
          }}
        >
          RECORD
        </strong>{' '}
        to start!
      </span>
    </div>
    <button
      onClick={e => {
        e.preventDefault();
        CameraTag.cameras[cameraId].record();
      }}
      style={{
        backgroundColor: 'rgba(227, 73, 28, .8)',
        borderRadius: '50%',
        borderStyle: 'none',
        boxShadow: 'rgba(0, 0, 0, .1) 0 10px 30px 0',
        cursor: 'pointer',
        height: '96px',
        outline: 'none',
        padding: '0',
        transitionDelay: '0s',
        transitionDuration: '.1s',
        transitionProperty: 'all',
        transitionTimingFunction: 'ease-in-out',
        width: '96px'
      }}
      className="ixYAQg"
    />
    <div
      style={{
        display: 'flex',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        WebkitBoxPack: 'center',
        justifyContent: 'center',
        height: '44px',
        width: '100%',
        position: 'absolute',
        bottom: '0px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: '120%',
        background: 'rgba(76, 217, 100, 0.8)',
        padding: '0px 8px'
      }}
    >
      <span aria-labelledby="selfie" role="img">
        😉&nbsp;
      </span>
      Don't worry! you can practice before sending.
    </div>
  </div>
);

export default RecordButton;
