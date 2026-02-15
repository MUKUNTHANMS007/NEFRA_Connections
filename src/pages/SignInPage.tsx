import React, { useEffect } from 'react';
import SignIn from '../components/SignIn';
import '../components/SignIn.css';

export default function SignInPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="signin-page-wrapper">
      <SignIn />

      <style>{`
        .signin-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(247,246,245,1) 100%);
        }
      `}</style>
    </div>
  );
}
