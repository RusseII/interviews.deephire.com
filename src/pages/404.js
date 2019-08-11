import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { showError } from '@/services/crisp';
import styles from './404.less';

export default function NotFound() {
  useEffect(() => {
    showError(
      'it looks like the link you clicked on is invalid. Which company are you interviewing for?'
    );
  }, []);
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button href="https://deephire.com" type="primary">
          Back Home
        </Button>
      }
    />
  );
}
