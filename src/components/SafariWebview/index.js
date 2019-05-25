import { hideChat } from '@/services/crisp';
import { Icon } from 'antd';
import { useEffect } from 'react';

export default () => {
  useEffect(() => hideChat());

  return (
    <div
      style={{
        backgroundColor: 'white',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: 'absolute',
      }}
    >
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        To take your interview - click the safari button on the bottom right
      </div>
      <div style={{ fontSize: 15, position: 'absolute', right: 10, bottom: 80 }}>
        Click Safari button below
      </div>

      <Icon
        style={{ fontSize: 40, position: 'absolute', right: 5, bottom: 40 }}
        type="arrow-down"
      />
    </div>
  );
};
