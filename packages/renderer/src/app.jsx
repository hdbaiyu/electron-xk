import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import '../assets/common.less';
// import Loading from "./Components/PageLoading";
// import theme from "../config/theme";
import ContentState from './ContentState';
import config from '../config';
import { renderRoutes } from 'react-router-config';
import routes from './routes';
import zhCN from 'antd/lib/locale/zh_CN';

ReactDOM.render(
  <React.StrictMode>
    <ContentState.Provider value={config}>
      <BrowserRouter basename="/">
        <ConfigProvider locale={zhCN}>{renderRoutes(routes)}</ConfigProvider>
      </BrowserRouter>
    </ContentState.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
// ReactDOM.render(
//     <Suspense fallback={<Loading />}>
//       <BrowserRouter basename="/">
//         <ContentState.Provider value={config}>
//         <Switch>
//           <Route path="/" exact={true} render={(props)=> <App {...props}/>} />
//           <Route path="/login" render={(props)=> <App {...props}/>} />
//           <Route path="/register" component={(props)=> <Register {...props}/>} />
//           <Route path="/home" children={
//             <MainLayouts>
//              <Route path='/home' exact={true}
//                      render={(props)=><Hello {...props} />} />
//               <Route path='/home/category' exact={true}
//                        render={(props)=> <Category {...props} />} />
//               <Route path='/home/goods' exact={true}
//                        render={(props)=> <Goods {...props} />} />
//               <Route path='/home/card' exact={true}
//                      render={(props)=> <CardCom {...props} />} />
//               <Route path='/home/download' exact={true}
//                 render={(props)=> <DownloadCom {...props}/>} />
//               <Route path='/home/gathering' exact={true}
//                      render={(props)=> <GatheringCode {...props} />} />
//               <Route path='/home/vip-member' exact={true}
//                 render={(props)=> <VipMember {...props} />} />
//               <Route path='/home/account-center' exact={true}
//                 render={(props)=> <AccountPage {...props} />} />
//               <Route path='/home/balance-center' exact={true}
//                 render={(props)=> <Accounting {...props}/>} />
//               <Route path='/home/equity-manage' exact={true}
//                 render={(props)=> <EquityManage {...props} />} />
//             </MainLayouts>
//           }/>
//         </Switch>
//         </ContentState.Provider>
//       </BrowserRouter>
//     </Suspense>,
//   document.getElementById('root')
// )
