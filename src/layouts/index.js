
import styles from "./index.less"
import { Layout, Row, Col } from 'antd';

const { Footer, Content, Header } = Layout;
function BasicLayout(props) {
  return (
    <Layout >
      <Header className={styles.header}>
        <Row type="flex"  justify="space-between">
          <Col>DeepHire</Col>
          <Col>
            <img
              src="https://s3.amazonaws.com/deephire/dh_vertical.png"
              alt="Forge"
              height="50px"
            />
          </Col>
        </Row>
      </Header>

      <Content className={styles.content}>
  
      {props.children}
      </Content>
      <Footer
  
        className={styles.footer}
      >
        Powered by DeepHire | Find your fit.
      </Footer>
    </Layout>
  );
}

export default BasicLayout;
