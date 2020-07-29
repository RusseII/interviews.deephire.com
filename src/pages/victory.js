
import { Button, Row, Rate, Form, Switch, Input, Typography } from 'antd';
import React, { useState } from 'react';
import styles from './victory.less';

export default () => {

  const [finished, setFinished] = useState(false)
  
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };

  const onFinish = (values) => {
    console.log("finish")
    console.log(values)
    setFinished(true)
  }

  if (finished) return <Success/>

  return (
    <div className={styles.wrapper}>
      <div style={{textAlign: 'center', marginBottom: 48}}>
 <Typography.Title>One Last Step</Typography.Title>
 <Typography.Text type='secondary'>All feedback is anonymous</Typography.Text>
 </div>
      <Form onFinishFailed={(fail) => console.log(fail)} onFinish={onFinish} {...layout}>
        <Form.Item  label="How would you rate the video introduction software?"
        name="rating"
        > <Rate/></Form.Item>
        <Form.Item name="issues" label="Did you have any software issues?"><Switch checkedChildren="Yes" unCheckedChildren="No"  /></Form.Item>
        <Form.Item name='ratingReason' label="Why did you give the rating above?"><Input.TextArea/></Form.Item>
        <Form.Item  label="Would you do another video intro like this in the future?"
        name="anotherIntervieew"
        > <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked /></Form.Item>
        <Form.Item  wrapperCol={{ xs: {span: 24 , offset: 0 }, sm: {span: 12 , offset:10 }} }><Button  type="primary" htmlType="submit">Complete Video Introduction</Button></Form.Item>
        
      </Form>
     
{/* 
      <Row type="flex" justify="center">
        <div className="OTPublisherContainer" style={{ overflow: 'hidden' }}>
          <img
            style={{ margin: '0 -100%', verticalAlign: 'middle' }}
            height="100%"
            src="https://deephire.s3.amazonaws.com/logos/trophy.gif"
            alt="Prepare to Record!"
          />
        </div>
      </Row>*/}
    </div>
  );
};


const Success = () => (
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
)
