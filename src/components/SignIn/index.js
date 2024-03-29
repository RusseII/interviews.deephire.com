/* global FS mixpanel */
import { Form } from '@ant-design/compatible';

import '@ant-design/compatible/assets/index.css';
import { Input, Button, Checkbox } from 'antd';
import { router } from 'umi';
import PropTypes from 'prop-types';
import { lowerCaseQueryParams } from '@/services/helpers';

import styles from './index.less';

const FormItem = Form.Item;

const appleoneProtection = 'https://deephire.s3.amazonaws.com/Agreement.pdf';
const appleOneCompayId = '5e95d7d3aed1120001480d69';
const SignIn = Form.create()(props => {
  const { form, location, skip, executeStartedEvent, companyId } = props;

  const { id, chat, simple, question: questionIndex } = lowerCaseQueryParams(location.search);

  const skipForm = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      mixpanel.track('Interview started');
      executeStartedEvent();
      router.push(`record${location.search}`);
    });
  };

  const AppleOneCheckBox = (
    <Checkbox>
      {' '}
      I agree to{' '}
      <a rel="noopener noreferrer" target="_blank" href={appleoneProtection}>
        AppleOne's Agreement
      </a>{' '}
      & the{' '}
      <a rel="noopener noreferrer" target="_blank" href="https://blog.deephire.com/privacy">
        Terms & Conditions
      </a>
    </Checkbox>
  );

  const checkboxField = companyId => {
    if (appleOneCompayId === companyId) {
      return (
        <FormItem>
          {form.getFieldDecorator('terms', {
            valuePropName: 'checked',
            initialValue: false,
            rules: [
              {
                transform: value => String(value),
                type: 'enum',
                enum: ['true'],
                message: 'Please review the Terms & Conditions.',
              },
            ],
          })(AppleOneCheckBox)}
        </FormItem>
      );
    } else {
    }
  };

  const nameEmailForm = () => (
    <>
      <h1 style={{ fontSize: 20 }}>Fill out the below info to get started!</h1>
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
            {checkboxField(companyId)}
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );

  const skipFormButton = () => (
    <Form>
      <h1 style={{ fontSize: 20, marginBottom: 40 }}>Click the button below to get started!</h1>
      {checkboxField(companyId)}
      <Button size="large" style={{ marginBottom: 40 }} type="primary" onClick={skipForm}>
        Take Interview Now
      </Button>
    </Form>
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
      mixpanel.track('Intervicytew started');
      FS.identify(email, {
        displayName: fullName,
        email,
      });

      // router.push(`record${location.search}`);
      executeStartedEvent(email, fullName);

      router.push(
        `record?id=${id}&fullName=${fullName}&email=${email}${
          simple === '1' ? '&simple=' + simple : ''
        }${chat === '0' ? '&chat=' + chat : ''}${questionIndex ? '&question=' + questionIndex : ''}`
      );

      form.resetFields();
    });
  };

  return skip ? skipFormButton() : nameEmailForm();
});

SignIn.propTypes = {
  location: PropTypes.object.isRequired,
  skip: PropTypes.bool.isRequired,
  companyId: PropTypes.string,
};
export default SignIn;
