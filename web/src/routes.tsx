/* eslint-disable react/react-in-jsx-scope */
import Home from './pages/Home/Home';
import Skins from './pages/Skins/Skins';
import Tiers from './pages/Tiers/Tiers';
import Transactions from './pages/Transactions/Transactions';

const routes = [
  {
    index: true,
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/skins',
    element: <Skins />,
  },
  {
    path: '/tiers',
    element: <Tiers />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  }
];

export { routes };
