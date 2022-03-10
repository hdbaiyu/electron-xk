
import { useState,useContext } from 'react';
import { Form, Input,Button, notification } from 'antd';
import { updatePassword } from '@/api/login';
import {useHistory} from 'react-router-dom';
import ContentState from "../ContentState";
import md5 from 'js-md5'


const SecurityCenter  = () => {
  const [loading, setLoading] = useState(false)
  const History = useHistory()
  const config = useContext(ContentState);

  const [form ] = Form.useForm()
  const submit = (values) => {

    if (values.password !== values.passwordOk) {
      form.setFields([
        {name: 'passwordOk',errors: ['新密码与确认密码不一致']},
      ])
      return
    }
    setLoading(true)
    const body = {
      old_password: md5(values.old_password),
      password: md5(values.password)
    }
    updatePassword(body).then(() => {
      notification.success({
        message: '修改成功, 请重新登录！'
      })
      setTimeout(() => {
        History.push('/')
        config.user = ''
        window.localStorage.removeItem('user')
      }, 2000)


    }).finally(()=>setLoading(false))
  }

  return (
    <div className='securityCenter'>
      <div className='contentCon'>
        <Form onFinish={submit} form={form} size="large" labelCol={{ span:4}} wrapperCol={{span: 10}}>
          <Form.Item name='old_password' label='当前密码' rules={[{ required: true, message: '请输入当前密码' }]}>
            <Input.Password placeholder='请输入当前密码' />
          </Form.Item>
          <Form.Item name='password' label='新密码' rules={[{ required: true, message: '请输入新密码' }]}>
            <Input.Password placeholder='请输入新密码'/>
          </Form.Item>
          <Form.Item name='passwordOk' label='确认密码' rules={[{ required: true, message: '请再次输入新密码' }]}>
            <Input.Password placeholder='请输入确认密码' />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6}}>
            <Button htmlType='submit' type="primary" className='submitBtn' loading={loading}>保存修改</Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  )
}

export default SecurityCenter;
