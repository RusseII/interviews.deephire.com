/* global FS mixpanel*/
import { Form, Input, Button } from 'antd';
import { router } from 'umi';

import styles from './index.less';
import qs from 'qs';

const FormItem = Form.Item;

const SignIn = Form.create()(props => {
  const { form, location } = props;
  const id = qs.parse(location.search)['?id'];

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
        interviewStage: 'started',
      });
      mixpanel.track('Interview started');
      FS.identify(id, {
        displayName: fullName,
        email,
      });
      router.push(`record?id=${id}&fullName=${fullName}&email=${email}&practice=true`);

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
            Take Practice Interview
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default SignIn;
