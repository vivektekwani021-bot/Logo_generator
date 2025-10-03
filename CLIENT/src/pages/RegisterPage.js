import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage = () => {
  // We pass the isRegister prop to tell the form to show the "Name" field
  // and set the correct titles and button text.
  return <AuthForm isRegister={true} />;
};

export default RegisterPage;

