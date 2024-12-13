import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from '../login-view/login-view';
import SignupView from '../signup-view/signup-view';
import Dashboard from '../dashboard/dashboard';

const MainView = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            {user ? <Dashboard /> : (<Navigate to="/login" />)}
          </>
        }
        />
        <Route path="/login" element={
          <>
            {user ? (<Navigate to="/" />) : <LoginView />}
          </>
        }
        />
        <Route path="/signup" element={
          <>
            {user ? (<Navigate to="/" />) : <SignupView />}
          </>
        }
        />

      </Routes>
    </BrowserRouter>
  );

};

export default MainView;
