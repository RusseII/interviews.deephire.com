/* global CameraTag */
import React from 'react';

const RecordButton = ({ cameraId, countdownStarted, loaded }) => {
  return (
    !countdownStarted && (
      <div>
        {loaded && (
          <div
            style={{
              zIndex: '9992229',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              WebkitBoxPack: 'end',
              justifyContent: 'flex-end',
              WebkitBoxAlign: 'center',
              alignItems: 'center',
              animation: '0.3s ease-in-out 0s 1 normal none running',
              padding: '0px 24px 1px'
            }}
          >
            <div
              style={{
                fontWeight: '500',
                fontSize: '18px',
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
                marginTop: 15,
                WebkitBoxPack: 'center',
                justifyContent: 'center',
                height: '44px',
                width: '100%',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center',
                lineHeight: '120%',
                padding: '0px 8px'
              }}
            >
              <span aria-labelledby="selfie" role="img">
                😉&nbsp;
              </span>
              Don't worry! you can practice before sending.
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default RecordButton;
