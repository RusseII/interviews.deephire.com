import { showError } from '@/services/crisp';
import React, { useEffect } from 'react';
import styles from './404.less';

export default function NotFound() {

  useEffect(() => {
    showError(
      'it looks like the link you clicked on is invalid. Which company are you interviewing for?'
    );
  }, []);
  return (
    <div className={styles.notFound}>
      <section>
        <h1>404</h1>
        <p>Interview not found</p>
        <p>Please contact our support</p>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: '#react-content { height: 100%; background-color: #fff }',
        }}
      />
    </div>
  );
}
