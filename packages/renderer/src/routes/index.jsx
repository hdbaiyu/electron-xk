import loadable from '@loadable/component';
import Home from '@/Login';
import QQ from '@/Login/QQ';
import BaseLayout from '@/Layouts/BaseLayouts';

const routesConfig = [
  {
    path: '/',
    exact: true,
    component: BaseLayout,
  },
  {
    path: '/login',
    exact: true,
    component: Home,
  },
  {
    path: '/qq',
    exact: true,
    component: QQ,
  },
  {
    path: '/register',
    exact: false,
    component: loadable(() => import('@/Register')),
  },
  {
    path: '/certification', // 实名认证
    exact: true,
    component: loadable(() => import('@/Certification')),
  },
  // APP 路由
  {
    path: '/home',
    exact: false,
    component: BaseLayout,
    routes: [
      {
        path: '/home',
        exact: true,
        component: loadable(() => import('@/Home/Hello')),
      },
      {
        path: '/home/category',
        exact: false,
        component: loadable(() => import('@/Home/Category')),
      },
      {
        path: '/home/goods',
        exact: false,
        component: loadable(() => import('@/Home/Goods')),
      },
      {
        path: '/home/card',
        exact: false,
        component: loadable(() => import('@/Home/Card')),
      },
      {
        path: '/home/gathering',
        exact: false,
        component: loadable(() => import('@/Home/GatheringCode/GatheringList')),
      },
      {
        path: '/home/vip-member',
        exact: false,
        component: loadable(() => import('@/Home/Vip')),
      },
      {
        path: '/home/account-center',
        exact: false,
        component: loadable(() => import('@/Account/Account-tab')),
      },
      {
        path: '/home/balance-center',
        exact: false,
        component: loadable(() => import('@/Home/Accounting/Accounting-Manage')),
      },
      {
        path: '/home/equity-manage',
        exact: false,
        component: loadable(() => import('@/Home/EquityManage/Equity-Tab')),
      },
      {
        path: '/home/download',
        exact: false,
        component: loadable(() => import('@/Home/Download')),
      },
      {
        path: '/home/income',
        exact: false,
        component: loadable(() => import('@/Home/Income')),
      },
      {
        path: '/home/order-details',
        exact: false,
        component: loadable(() => import('@/Home/OrderDetails')),
      },
      {
        path: '/home/order',
        exact: false,
        component: loadable(() => import('@/Home/Order')),
      },
      {
        path: '/home/promote',
        exact: false,
        component: loadable(() => import('@/Home/Promote')),
      },
    ],
  },
];

export default routesConfig;
// export default renderRoutes;
// const App = Ladable({loader: ()=> import('./Login'), loading: ()=> <div>sfdsfdssf</div>})
// const Register = lazy(()=> import('./Register'))
// const Hello = lazy(()=> import('./Home/Hello'))
// const Category = lazy(()=> import('./Home/Category'))
// const Goods = lazy(()=> import('./Home/Goods'))
// const BaseLayouts = lazy(()=> import('./Layouts/BaseLayouts'))
// const CardCom = lazy(()=> import('./Home/Card'))
// const DownloadCom = lazy(()=> import('./Home/Download'))
// const GatheringCode = lazy(()=> import('./Home/GatheringCode/GatheringList'))
// const VipMember = lazy(()=> import('./Home/Vip'))
// const AccountPage = lazy(()=> import('./Account/Account-tab'))
// const Accounting = lazy(()=> import('./Home/Accounting/Accounting-Manage'))
// const EquityManage = lazy(()=> import('./Home/EquityManage/Equity-Tab'))
