/* global mixpanel */
import React, { useEffect, useState } from 'react';
import CameraTag from '@/components/CameraTag';
import { fetchInterview, storeInterviewQuestionRework } from '@/services/api';

import { router } from 'umi';

import qs from 'qs';
import Texty from 'rc-texty';
import QueueAnim from 'rc-queue-anim';

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

  const completedQ = (response, responseThumbnail, uuid) => {
    setIndex(index => {
      const interviewData = {
        interviewId: id,
        userId: email,
        userName: fullName,
        candidateEmail: email,
        interviewName: data.interviewName,
        question: data.interviewQuestions[index].question,
        response,
        responseThumbnail,
        uuid,
      };
      storeInterviewQuestionRework(interviewData);

      if (index + 1 === interviewQuestions.length) {
        storeInterviewQuestionRework(interviewData, data.createdBy);
        mixpanel.people.set({
          interviewStage: 'completed',
        });
        mixpanel.track('Interview completed');
        router.push(`/victory?id=${id}`);
        return index;
      } else {
        return index + 1;
      }
    });
  };
  if (!data) return null;

  const { interviewQuestions } = data;
  return (
    <>
      <h3 key={index} style={{ textAlign: 'center' }}>{`Question ${index + 1}/${
        interviewQuestions.length
      }`}</h3>
      <h1 style={{ color: '#2f69f8', textAlign: 'center' }}>
        <QueueAnim type="alpha">
          <Texty key={index} leave={{}}>
            {interviewQuestions[index].question}
          </Texty>
        </QueueAnim>
      </h1>
      <CameraTag
        name={`${fullName}: ${interviewQuestions[index].question}`}
        description={`${email} ${id} ${index}`}
        onUpload={completedQ}
      />
    </>
  );
};
export default Record;
