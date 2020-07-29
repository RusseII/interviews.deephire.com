
import { Button, Row, Rate, Form, Switch, Input, Typography } from 'antd';
import React, { useState, useContext } from 'react';
import styles from './victory.less';
import { submitFeedback } from '@/services/api'
import { CompleteInterviewDataContext } from '@/layouts'


export default () => {

  const [finished, setFinished] = useState(false)

  const completeInterviewData = useContext(CompleteInterviewDataContext)
    const interviewId = completeInterviewData?.interviewData?._id
    const companyId = completeInterviewData?.companyData?._id

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };

  const onFinish = (values) => {
    setFinished(true)
    submitFeedback( interviewId, companyId, values)
    
  }

  if (finished) return <Success />

  return (
    <div className={styles.wrapper}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Typography.Title>One Last Step</Typography.Title>
        <Typography.Text type='secondary'>All feedback is anonymous</Typography.Text>
      </div>
      <Form initialValues={{ anotherInterview: true, issues: false }} onFinish={onFinish} {...layout}>
        <Form.Item label="How would you rate the video introduction software?" name="rating">
          <Rate />
        </Form.Item>
        <Form.Item valuePropName='checked' name="issues" label="Did you have any software issues?">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
        <Form.Item name='ratingReason' label="Why did you give the rating above?">
          <Input.TextArea />
        </Form.Item>
        <Form.Item valuePropName='checked' name="anotherInterview" label="Would you do another video intro like this in the future?">
          <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
        </Form.Item>
        <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 12, offset: 10 } }}><Button type="primary" htmlType="submit">Complete Video Introduction</Button></Form.Item>

      </Form>
    </div>
  );
};


const Success = () => (
  <div className={styles.wrapper} style={{ textAlign: 'center' }}>

    <div style={{ marginBottom: 24 }}>
      <Typography.Title>Video Introduction Completed!</Typography.Title>
      <Typography.Text type='secondary'> Your Video Introduction has been successfully submitted</Typography.Text>
    </div>
    <Row type="flex" justify="center">
      <div className="OTPublisherContainer" style={{ overflow: 'hidden' }}>
        <img
          style={{ margin: '0 -100%', verticalAlign: 'middle' }}
          height="100%"
          src="https://deephire.s3.amazonaws.com/logos/trophy.gif"
          alt="Prepare to Record!"
        />
      </div>
    </Row>
  </div>
)
