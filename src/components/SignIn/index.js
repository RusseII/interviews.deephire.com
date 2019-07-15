/* global FS mixpanel*/
import { Form, Input, Button } from 'antd';
import { router } from 'umi';
import PropTypes from 'prop-types';

import styles from './index.less';
import qs from 'qs';

const FormItem = Form.Item;

const SignIn = Form.create()(props => {
  const { form, location, removeExitIntent, text, metaData } = props;
  const id = qs.parse(location.search)['?id'];
  const fullNameParam = qs.parse(location.search)['fullName'];
  const emailParam = qs.parse(location.search)['email'];

  const skipForm = () => {
    mixpanel.track('Interview started');
    router.push(`cameratag?id=${id}&fullName=${fullNameParam}&email=${emailParam}&practice=true`);
    removeExitIntent();
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
        $email: email, // only special properties need the $
        $last_login: new Date(), // properties can be dates...
        $name: fullName,
        id,
        metaData,
        interviewStage: 'started',
      });
      mixpanel.track('Interview started');
      FS.identify(id, {
        displayName: fullName,
        email,
      });
      router.push(`cameratag?id=${id}&fullName=${fullName}&email=${email}&practice=true`);
      removeExitIntent();
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
