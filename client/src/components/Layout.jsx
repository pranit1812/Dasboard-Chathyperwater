import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-deep-navy text-light-gray">
      <header className="bg-deep-navy/90 shadow-md py-4 px-6 border-b border-cyan/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/Chatlogo.png" alt="Feedback Dashboard Logo" className="w-10 h-auto mr-3" />
            <h1 className="text-xl font-bold text-cyan">Feedback Dashboard</h1>
          </div>
          <div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-light-gray hover:text-cyan"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-deep-navy/90 py-4 px-6 border-t border-cyan/20 text-center text-sm text-light-gray/70">
        <p>&copy; {new Date().getFullYear()} Feedback Dashboard</p>
      </footer>
    </div>
  );
};

export default Layout; 