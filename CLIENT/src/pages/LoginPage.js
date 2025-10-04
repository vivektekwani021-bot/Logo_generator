import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage = () => {
  return (
    // We pass isRegister={false} to tell the form to act as a login form
    <AuthForm isRegister={false} />
  );
};

export default LoginPage;

