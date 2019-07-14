import React, { useEffect, useState } from 'react';
import CameraTag from '@/components/CameraTag';
import {
  fetchInterview,
  notifyCandidate,
  notifyRecruiter,
  storeInterviewQuestionRework,
} from '@/services/api';

import { Modal } from 'antd';
import { router } from 'umi';

import practiceQuestions from '@/services/practiceInterviewQuestions';

import qs from 'qs';
import Texty from 'rc-texty';

require('rc-texty/assets/index.css');

const Record = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const fullName = qs.parse(location.search)['fullName'];
  const email = qs.parse(location.search)['email'];

  const [index, setIndex] = useState(0);

  const [data, setData] = useState(null);

  const setup = async () => {
    var [data] = await fetchInterview(id);
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

  const completedQ = (response, responseThumbnail) => {
    console.log('is response new?', response);
    setIndex(index => {
      const interviewData = {
        interviewId: id,
        userId: email,
        userName: fullName,
        candidateEmail: email,
        interviewName: data.interviewName,
        question: data.interviewName.interviewQuestions[index],
        response,
        responseThumbnail,
      };
      storeInterviewQuestionRework(interviewData);
      return index + 1;
    });
  };
  if (!data) return null;

  const { interviewQuestions } = data;
  return (
    <>
      <h3 key={index} style={{ textAlign: 'center' }}>{`Question ${index + 1}/${
        interviewQuestions.length
      }`}</h3>
      <h1 style={{ textAlign: 'center' }}>{interviewQuestions[index].question}</h1>
      <CameraTag onUpload={completedQ} />
    </>
  );
};
export default Record;
