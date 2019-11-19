/* global mixpanel */
import React, { useEffect, useState } from 'react';
import CameraTag from '@/components/CameraTag';
import Timer from '@/components/Timer';


import { fetchInterview, storeInterviewQuestionRework } from '@/services/api';
import { Typography, Row, Col, Icon, List, Button, Drawer } from 'antd';

import styles from './index.less';

import { router } from 'umi';

import qs from 'qs';

import HandleBrowsers from '@/components/HandleBrowsers';
const { Title, Paragraph } = Typography;

const data = [
  'Focus on your most recent job title and experience.',
  'Talk about your most impressive accomplishments.', 
  'Include one or two sentences about what type of organization you are looking for.'

];

const TipDrawer = ({drawerVisible, setDrawerVisible}) => (
  <Drawer
    width={350}
    title='Tips & Examples'
    placement='right'
    closable={true}
    onClose={() => setDrawerVisible(false)}
    visible={drawerVisible}
  > 
  {/* <Title level={4}>Introduce yourself</Title> */}

    <Paragraph type="secondary">Give employers an idea of you are as a candidate. Try to fully answer each of the questions. </Paragraph>
<List
     
      
      dataSource={data}
      renderItem={(item, i) => (
        <div>
          <Typography.Text >{i+1}.</Typography.Text> {item}
        </div>
      )}
    />
  </Drawer>
);
const Record = ({ location }) => {
  const id = qs.parse(location.search)['?id'];
  const fullName = qs.parse(location.search)['fullName'];
  const email = qs.parse(location.search)['email'];
  const simple = qs.parse(location.search)['simple'];

  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);


  useEffect(() => {
    const setup = async () => {
      var [data] = await fetchInterview(id);
      setData(data);
    };

    setup();
  }, [id]);

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
        storeInterviewQuestionRework(interviewData, data.createdBy);
        mixpanel.people.set({
          interviewStage: 'completed',
        });
        mixpanel.track('Interview completed');
        router.push(`/victory?id=${id}${simple === '1' ? '&simple=' + simple : ''}`);
        return index;
      } else {
        storeInterviewQuestionRework(interviewData);
        return index + 1;
      }
    });
  };
  if (!data) return null;

  const { interviewQuestions } = data;
  return (
    <HandleBrowsers>
      <div className={styles.wrapper}>
        <TipDrawer setDrawerVisible={setDrawerVisible} drawerVisible={drawerVisible}/>
        {/* <h3 key={index} style={{ textAlign: 'center' }}>{`Question ${index + 1}/${
        interviewQuestions.length
      }`}</h3> */}
        <Row type="flex" justify="center">
         
          <Col style={{ textAlign: 'center' }} lg={12} sm={20} xs={24}>
            <Title level={2} style={{ marginBottom: 8 }}>
             {interviewQuestions[index].question}
              <Button onClick={() => setDrawerVisible(true)} size='small' shape='circle' icon='info' />
            </Title>

            {/* <Title level={4} type='secondary' style={{ marginTop: 0 }}>
              Give some examples of your work/ study/ life experiences (During my time at... I was
              able to... meaning I can now... for you)...
            </Title> */}
          </Col>

        
        </Row>
        <CameraTag
          name={`${fullName} ${data.interviewName}`}
          description={`${email} ${id} ${index} ${data.createdBy}`}
          onUpload={completedQ}
          maxLength={data.interviewConfig.answerTime}
        />
      </div>
    </HandleBrowsers>
  );
};
export default Record;
