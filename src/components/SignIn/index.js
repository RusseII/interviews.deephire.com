/* global FS mixpanel $crisp */
import { Form, Input, Button } from 'antd';
import { router } from 'umi';
import PropTypes from 'prop-types';
import { lowerCaseQueryParams } from '@/services/helpers';

import styles from './index.less';

const FormItem = Form.Item;

const SignIn = Form.create()(props => {
  const { form, location, text, skip} = props;

  const { id} = lowerCaseQueryParams(location.search);

  const skipForm = () => {
    mixpanel.track('Interview started');
    router.push(`record${location.search}`);
  };

  const nameEmailForm = () => (
    <>
    <h1 style={{fontSize: 20}}>Fill out the below info to get started!</h1>
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
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
    </>
  );

  const skipFormButton = () => (
    <>
    <h1 style={{fontSize: 20}}>Click the button below to get started!</h1>
    <Button
      size="large"
      style={{ marginTop: 40, marginBottom: 40 }}
      type="primary"
      onClick={skipForm}
    >
      Take Interview Now
    </Button>
    </>
  );

  // if (fullNameParam && emailParam) {
  //   return (

  //   );
  // }

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
        interviewStage: 'started',
      });
      mixpanel.track('Interview started');
      FS.identify(email, {
        displayName: fullName,
        email,
      });
      $crisp.push(['set', 'user:email', email]);
      $crisp.push(['set', 'user:nickname', [fullName]]);

      router.push(`record${location.search}`);

      form.resetFields();
    });
  };

  return skip ? skipFormButton() : nameEmailForm();
});

SignIn.propTypes = {
  location: PropTypes.object.isRequired,
  skip: PropTypes.bool.isRequired,
};
export default SignIn;
