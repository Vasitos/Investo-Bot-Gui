import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import DashboardStockRecommendation from './pages/DashboardStockRecommendation';
import DashboardStockPrediction from './pages/DashboardStockPrediction'

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { element: <Navigate to="/dashboard/recommend" />, index: true },
        { element: <Navigate to="/dashboard/predict" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'recommend', element: <DashboardStockRecommendation /> },
        { path: 'predict', element: <DashboardStockPrediction /> },

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
