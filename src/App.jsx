import { BrowserRouter, Routes, Route } from 'react-router-dom';
import router from '@/Routes/Routes';
import { Suspense } from 'react';
import { SideBarProvider } from './contexts/SideBarProvide';
import SideBar from './components/SideBar/SideBar';

function App() {
  return (
    <SideBarProvider>
      <SideBar />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {router.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={<item.component />}
                />
              );
            })}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SideBarProvider>
  );
}

export default App;
