import { Card, Switch, Button } from 'antd';

export default function WechatMessage() {
  return (
    <div className="wechatMessage">
      <Card
        title={
          <div className="flex-between">
            <div>消息通知管理</div>
            <Switch size="default" checkedChildren="开启" unCheckedChildren="关闭"></Switch>
          </div>
        }
        style={{ width: 300 }}
      >
        <p>
          <Button type={'primary'}>添加微信消息接收人</Button>
        </p>
      </Card>
    </div>
  );
}
