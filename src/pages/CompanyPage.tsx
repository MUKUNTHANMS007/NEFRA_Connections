import React, { useEffect } from 'react';
import Company from '../components/Company';
import '../components/Company.css';

export default function CompanyPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="company-page-wrapper">
      {/* Main Company Component */}
      <Company />

      {/* Additional Professional Sections can be added below */}
      <style>{`
        .company-page-wrapper {
          min-height: 100vh;
          padding-top: 90px; /* Account for fixed header */
          background: linear-gradient(to bottom right, #0a192f, #112240, #020c1b);
        }

        /* Ensure smooth transitions between pages */
        .company-page-wrapper {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhance scrollbar for dark theme */
        .company-page-wrapper::-webkit-scrollbar {
          width: 8px;
        }

        .company-page-wrapper::-webkit-scrollbar-track {
          background: rgba(52, 152, 219, 0.05);
        }

        .company-page-wrapper::-webkit-scrollbar-thumb {
          background: rgba(52, 152, 219, 0.3);
          border-radius: 4px;
        }

        .company-page-wrapper::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 152, 219, 0.5);
        }
      `}</style>
    </div>
  );
}