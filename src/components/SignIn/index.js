/* global FS mixpanel $crisp */
import { Form, Input, Button } from 'antd';
import { router } from 'umi';
import PropTypes from 'prop-types';
import { lowerCaseQueryParams } from '@/services/helpers';

import styles from './index.less';


const FormItem = Form.Item;

const SignIn = Form.create()(props => {
  const { form, location, text, metaData } = props;


  const { id, fullname: fullNameParam, email: emailParam } = lowerCaseQueryParams(location.search);

  const skipForm = () => {
    console.log(location.search)
    mixpanel.track('Interview started');
    router.push(
      `record${location.search}`
    );
  };


  if (fullNameParam && emailParam) {
    return (
      <Button
        size="large"
        style={{ marginTop: 40, marginBottom: 40 }}
        type="primary"
        onClick={skipForm}
      >
        {text}
      </Button>
    );
  }

  const okHandle = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { fullName, email } = fieldsValue;

      mixpanel.alias(email);
      mixpanel.people.set({
        $email: email,
        $last_login: new Date(),
        $name: fullName,
        id,
        metaData,
        interviewStage: 'started',
      });
      mixpanel.track('Interview started');
      FS.identify(email, {
        displayName: fullName,
        email,
      });
      $crisp.push(['set', 'user:email', email]);
      $crisp.push(['set', 'user:nickname', [fullName]]);

      router.push(
        `record${location.search}`
      );

      form.resetFields();
    });
  };

  return (
    <div className={styles.container}>
      <Form hideRequiredMark onSubmit={okHandle}>
        <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 5 }} label="Name">
          {form.getFieldDecorator('fullName', {
            rules: [
              {
                required: true,
                message: 'Please input your full name!',
              },
            ],
          })(<Input placeholder="full name" />)}
        </FormItem>
        <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 5 }} label="Email">
          {form.getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input placeholder="email" />)}
        </FormItem>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {text}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

SignIn.propTypes = {
  location: PropTypes.object.isRequired,
  removeExitIntent: PropTypes.func,
  text: PropTypes.string.isRequired,
  metaData: PropTypes.string,
};
export default SignIn;
