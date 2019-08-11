/* global FS mixpanel */
import React from 'react';
import { Form, Input, Button } from 'antd';
import { router } from 'umi';
import PropTypes from 'prop-types';
import qs from 'qs';
import styles from './index.less';

const FormItem = Form.Item;

const SignIn = Form.create()(props => {
  const { form, location, removeExitIntent, text, subText, metaData } = props;
  const id = qs.parse(location.search)['?id'];
  const fullNameParam = qs.parse(location.search).fullName;
  const emailParam = qs.parse(location.search).email;

  const skipForm = () => {
    mixpanel.track('Interview started');
    router.push(
      `cameratag?id=${id}&fullName=${fullNameParam}&email=${emailParam}&practice=true`
    );
    removeExitIntent();
  };
  if (fullNameParam && emailParam) {
    return [
      <Button
        size="large"
        key={1}
        style={{ marginTop: 40, marginBottom: 40 }}
        type="primary"
        onClick={skipForm}
      >
        {text}
      </Button>
    ];
  }

  const okHandle = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { fullName, email } = fieldsValue;

      mixpanel.alias(email);
      mixpanel.people.set({
        $email: email, // only special properties need the $
        $last_login: new Date(), // properties can be dates...
        $name: fullName,
        id,
        metaData,
        interviewStage: 'started'
      });
      mixpanel.track('Interview started');
      FS.identify(id, {
        displayName: fullName,
        email
      });
      router.push(
        `cameratag?id=${id}&fullName=${fullName}&email=${email}&practice=true`
      );
      removeExitIntent();
      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <Form hideRequiredMark layout="vertical" onSubmit={okHandle}>
        <FormItem colon={false} label="Your name">
          {form.getFieldDecorator('fullName', {
            rules: [
              {
                required: true,
                message: 'Your name is required'
              }
            ]
          })(<Input placeholder="John Smith" />)}
        </FormItem>
        <FormItem label="Your email address">
          {form.getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'Does not appear to be a valid email address'
              },
              {
                required: true,
                message: 'Email is required'
              }
            ]
          })(<Input placeholder="john@smith.com" />)}
        </FormItem>
        <Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            {text}
          </Button>
          <p style={{ marginTop: 10, fontSize: 11 }}>{subText}</p>
        </Form.Item>
      </Form>
    </div>
  );
});

SignIn.propTypes = {
  location: PropTypes.object.isRequired,
  removeExitIntent: PropTypes.func,
  text: PropTypes.string.isRequired,
  metaData: PropTypes.string
};
export default SignIn;
