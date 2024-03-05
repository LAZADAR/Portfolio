import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from './Pages/layout/Layout';
import WalletLayout from './Pages/WalletLayout/WalletLayout';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import NotFoundWallet from './Pages/NotFoundWallet/NotFoundWallet';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="home" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio/:walletName" element={<WalletLayout />} />
        <Route path="portfolio/*" element={<NotFoundWallet />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
