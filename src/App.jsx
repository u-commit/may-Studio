import { BrowserRouter, Routes, Route } from 'react-router-dom';
import router from '@/Routes/Routes';
import { Suspense } from 'react';
import { SideBarProvider } from './contexts/SideBarProvide';
import SideBar from './components/SideBar/SideBar';
import { ToastProvider } from './contexts/ToastProvide';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SideBarProvider>
          <BrowserRouter>
            <SideBar />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {router.map((item, index) => {
                const Page = item.component;
                const page = <Page />;
                return (
                  <Route
                    key={index}
                    path={item.path}
                    element={item.role
                      ? <ProtectedRoute requiredRole={item.role}>{page}</ProtectedRoute>
                      : page}
                  />
                );
              })}
            </Routes>
          </Suspense>
          </BrowserRouter>
        </SideBarProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
