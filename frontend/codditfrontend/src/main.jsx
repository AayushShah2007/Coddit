import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Layout shell
import App from './App.jsx';

// Pages
import Feed from './pages/Feed.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Uploads from './pages/Uploads.jsx';
import MyAccount from './pages/MyAccount.jsx';
import Login from './pages/Login.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />, // Serves as the main layout containing Sidebar & <Outlet />
    children: [
      {
        index: true,
        element: <Navigate to="/feed" replace />,
      },
      {
        path: 'feed',
        element: <Feed />,
      },
      {
        path: 'create-post',
        element: <CreatePost />,
      },
      {
        path: 'uploads',
        element: <Uploads />,
      },
      {
        path: 'my-account',
        element: <MyAccount />,
      },
      {
        path: '*',
        element: <Navigate to="/feed" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);