
import styles from "./index.css"
import { Layout, Row, Col } from 'antd';

const { Footer, Content, Header } = Layout;
function BasicLayout(props) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        {/* edit the padding to be smaller on mobile */}
        {/* <Breadcrumb key="a" style={{ margin: '16px 0' }}> */}
        {/* <Breadcrumb.Item>{props.title}</Breadcrumb.Item> */}
        {/* </Breadcrumb> */}

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
