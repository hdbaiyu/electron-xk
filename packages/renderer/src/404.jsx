import { Button, Result } from 'antd';

const NoFoundPage = (props) => (
  <Result
    status="404"
    title="抱歉！页面未找到。"
    subTitle="404"
    extra={[
      <Button key="btn1" size="large" shape="round" onClick={() => props.history.goBack()}>
        返回
      </Button>,
      <Button
        key="btn2"
        size="large"
        shape="round"
        type="primary"
        onClick={() => props.history.replace('/')}
      >
        去首页
      </Button>,
    ]}
  />
);

export default NoFoundPage;
