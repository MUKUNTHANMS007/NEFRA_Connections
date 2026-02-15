import React, { useEffect } from 'react';
import SignUp from '../components/SignUp';
import '../components/SignIn.css';

export default function SignUpPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="signup-page-wrapper">
      <SignUp />
      <style>{`
        .signup-page-wrapper { min-height: 100vh; background: linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(247,246,245,1) 100%); }
      `}</style>
    </div>
  );
}
