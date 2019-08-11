/* global mixpanel */
import React, { useEffect, useState } from 'react';

import { router } from 'umi';

import { Button, Steps, Typography } from 'antd';

import qs from 'qs';
import { fetchInterview, storeInterviewQuestionRework } from '@/services/api';
import CameraTag from '@/components/CameraTag';

import HandleBrowsers from '@/components/HandleBrowsers';

const { Title } = Typography;

const { Step } = Steps;

const Record = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const { fullName } = qs.parse(location.search);
  const { email } = qs.parse(location.search);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);

  const setup = async () => {
    const [data] = await fetchInterview(id);
    setData(data);
    // const {
    //   createdBy,
    //   interviewName,
    //   interviewConfig: { answerTime, prepTime, retakesAllowed } = {},
    //   interviewQuestions: interviewQ = [],
    // } = data || {};
  };

  useEffect(() => {
    setup();
  }, []);

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
        uuid
      };

      if (index + 1 === data.interviewQuestions.length) {
        storeInterviewQuestionRework(interviewData, data.createdBy);
        mixpanel.people.set({
          interviewStage: 'completed'
        });
        mixpanel.track('Interview completed');
        router.push(`/victory?id=${id}`);
        return index;
      }
      storeInterviewQuestionRework(interviewData);
      return index + 1;
    });
  };
  if (!data) return null;

  const { interviewQuestions } = data;
  return (
    <HandleBrowsers>
      <Button type="primary" shape="round" size="small">
        {`Question ${index + 1}/${interviewQuestions.length}`}
      </Button>
      <Title level={2} style={{ textAlign: 'center' }}>
        <p>{interviewQuestions[index].question}</p>
      </Title>
      <CameraTag
        name={`${fullName} ${data.interviewName}`}
        description={`${email} ${id} ${index} ${data.createdBy}`}
        onUpload={completedQ}
        maxLength={data.interviewConfig.answerTime}
      />
    </HandleBrowsers>
  );
};
export default Record;
