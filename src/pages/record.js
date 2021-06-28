/* global mixpanel */
import React, { useContext, useState } from 'react';
import CameraTag from '@/components/CameraTag';
import { useInterview } from '../services/apiHooks';

import ReactPlayer from 'react-player';

import { storeInterviewQuestionRework } from '@/services/api';
import { InfoOutlined } from '@ant-design/icons';
import { Typography, Row, Col, List, Button, Drawer } from 'antd';

import styles from './index.less';

import { router } from 'umi';

import { lowerCaseQueryParams } from '@/services/helpers';

import HandleBrowsers from '@/components/HandleBrowsers';
import { CompleteInterviewDataContext } from '@/layouts';
const { Title, Paragraph } = Typography;

const mockData = [
  'Focus on your most recent job title and experience.',
  'Talk about your most impressive accomplishments.',
  'Include one or two sentences about what type of organization you are looking for.',
];

function replaceUrlParam(url, paramName, paramValue) {
  if (paramValue == null) {
    paramValue = '';
  }
  var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  url = url.replace(/[?#]$/, '');
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
}

const addQuestionIndexQueryParam = index => {
  const myNewURL = replaceUrlParam(window.location.href, 'question', index + 1);
  window.history.pushState({}, document.title, myNewURL);
};

const TipDrawer = ({ drawerVisible, setDrawerVisible, questionInfo, tips, exampleVideos }) => (
  <Drawer
    width={350}
    title="Tips & Examples"
    placement="right"
    closable={true}
    onClose={() => setDrawerVisible(false)}
    visible={drawerVisible}
  >
    <Paragraph type="secondary">
      {questionInfo || 'These videos are a chance to show off what makes you unique.'}
    </Paragraph>
    <List
      dataSource={tips || mockData}
      renderItem={(item, i) => (
        <div>
          <Typography.Text>{i + 1}.</Typography.Text> {item}
        </div>
      )}
    />

    {exampleVideos && (
      <List
        dataSource={exampleVideos}
        renderItem={(item, i) => (
          <ReactPlayer style={{ marginTop: 24 }} url={item} width={300} height={169} />
        )}
      />
    )}
  </Drawer>
);
const Record = ({ location }) => {
  const { data: interviewData } = useInterview();

  const { id, fullname: fullName, email, question: questionIndex } = lowerCaseQueryParams(
    location.search
  );
  const startingQuestionIndex = parseInt(questionIndex) - 1;

  const [index, setIndex] = useState(startingQuestionIndex ? startingQuestionIndex : 0);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const completeInterviewData = useContext(CompleteInterviewDataContext);
  const data = completeInterviewData?.interviewData;
  const companyId = completeInterviewData?.companyData?._id;

  let mobile = false;
  const width = () =>
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (width() < 576) mobile = true;

  const completedQ = (medias, uuid) => {
    setIndex(index => {
      const interviewData = {
        interviewId: id,
        userId: email,
        userName: fullName,
        candidateEmail: email,
        interviewName: data.interviewName,
        question: data.interviewQuestions[index].question,
        medias,
        uuid,
      };

      if (index + 1 === interviewQuestions.length) {
        storeInterviewQuestionRework(
          interviewData,
          data.createdBy,
          companyId,
          completeInterviewData,
          true
        );
        mixpanel.people.set({
          interviewStage: 'completed',
        });
        mixpanel.track('Interview completed');
        router.push(`/victory${location.search}`);
        return index;
      } else {
        storeInterviewQuestionRework(
          interviewData,
          data.createdBy,
          companyId,
          completeInterviewData
        );
        addQuestionIndexQueryParam(index + 1);
        return index + 1;
      }
    });
  };
  if (!data) return null;

  const { interviewQuestions, interviewConfig, createdBy } = data;
  //  {tips, hint, questionInfo, exampleVideos} = interviewQuestions
  const currentQuestion = interviewQuestions[index];
  const { question, hint, questionInfo, tips, exampleVideos, answerTime } = currentQuestion;
  return (
    <HandleBrowsers>
      <div className={styles.wrapper}>
        <TipDrawer
          questionInfo={questionInfo}
          tips={tips}
          exampleVideos={exampleVideos}
          setDrawerVisible={setDrawerVisible}
          drawerVisible={drawerVisible}
        />
        {/* <h3 key={index} style={{ textAlign: 'center' }}>{`Question ${index + 1}/${
        interviewQuestions.length
      }`}</h3> */}
        <Row type="flex" justify="center">
          <Col style={{ textAlign: 'center' }} lg={12} sm={20} xs={24}>
            <Paragraph style={{ marginBottom: 0 }} type="secondary">{`Question ${index + 1}/${
              interviewQuestions.length
            }`}</Paragraph>
            <Title level={mobile ? 4 : 2} style={{ marginBottom: 8, marginTop: 0 }}>
              {question}
              <Button
                onClick={() => setDrawerVisible(true)}
                shape="circle"
                icon={<InfoOutlined />}
                style={{ marginLeft: 8 }}
              />
            </Title>

            {hint && (
              <Title level={4} type="secondary" style={{ marginTop: 0 }}>
                {hint}
              </Title>
            )}
          </Col>
        </Row>
        <CameraTag
          mobile={mobile}
          name={`${createdBy} ${fullName} ${data.interviewName}`}
          description={`${JSON.stringify(currentQuestion)} ${email} ${id} ${index} ${
            data.createdBy
          }`}
          onUpload={completedQ}
          maxLength={answerTime || interviewConfig.answerTime}
        />
        <Row type="flex" justify="center" style={{ textAlign: 'center' }}>
          <Paragraph style={{ fontSize: mobile ? '1.25em' : '1.75em', marginBottom: 0 }}>
            {' '}
            This question is timed! You have {answerTime || interviewConfig.answerTime} seconds{' '}
            {interviewData?.disableRetakes ? '' : 'and unlimited retakes'}.
          </Paragraph>
        </Row>
      </div>
    </HandleBrowsers>
  );
};
export default Record;
