import React, { useState, useEffect } from 'react';
import styles from './index.less';
import ReactPlayer from 'react-player';
import { Upload, Steps, Row, Col } from 'antd';
import SignIn from '@/components/SignIn';
import qs from 'qs';
import { fetchInterview, fetchCompanyInfo } from '@/services/api';

const props = {
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [
    {
      uid: '1',
      name: 'HR Director.docx',
      url: 'https://s3.amazonaws.com/deephire/logos/HR+Director.docx',
    },
    {
      uid: '2',
      name: 'Electrocraft Overview.pdf',
      url: 'https://s3.amazonaws.com/deephire/logos/Electrocraft+overview.pdf',
    },
  ],
};

const Index = ({ location }) => {
  const id = qs.parse(location.search)['?id'];


  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Loading...',
    logo:
      'http://atelier.swiftideas.com/union-demo/wp-content/uploads/sites/5/2014/05/unionproducts-img-blank.png',
    introVideo: 'https://vimeo.com/296044829/74bfec15d8',
  });

  useEffect(() => {
    fetchInterview(id).then(r => {
      if (r[0]) {
        const { email: createdBy } = r[0];
        fetchCompanyInfo(createdBy).then(r =>{
          if (r) {
            (r.introVideo) ? console.log("companyVideo exists") : (r.introVideo = "https://vimeo.com/296044829/74bfec15d8")
            setCompanyInfo(r)
          }
          else { 
          setCompanyInfo({companyName: "Not Found", introVideo: 'https://vimeo.com/296044829/74bfec15d8'}
          )
          }
          });
      }
    });
    console.log(companyInfo);
  }, []);
  return (
    <div className={styles.normal}>
      
      <div style={{ paddingTop: '24px' }}>
        <h1>Welcome to your Video Interview!</h1>{' '}
      </div>

      <Row type="flex" justify="center">
        <Col span={15} xxl={11} xl={12}>
          <div className={styles.playerWrapper}>
            <ReactPlayer
              key={companyInfo.introVideo}
              className={styles.reactPlayer}
              url={companyInfo.introVideo}
              width="100%"
              height="100%"
            />
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        {id == '5c93849154b7ba00088dde51' && <Upload {...props} />}
      </Row>

      <SignIn location={location} />
    </div>
  );
};

export default Index;
