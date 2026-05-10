import HomePage from '../pages/index/index';
import RequestDemoPage from '../pages/request-demo/index';

export const routes = [
  {
    path: '/',
    component: HomePage,
    name: 'Home',
  },
  {
    path: '/request-demo',
    component: RequestDemoPage,
    name: 'Request Demo',
  },
];

export default routes;
