import React, { useEffect } from 'react';
import { routes } from './routes';
import { cssVariables } from './theme';

// Import CSS files
import './styles/global.css';
import './styles/background.css';
import './styles/navbar.css';
import './styles/buttons.css';
import './styles/hero.css';
import './styles/animations.css';
import './styles/responsive.css';

const App = () => {
  // Inject CSS variables into the page
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = cssVariables;
    document.head.appendChild(styleTag);
  }, []);

  // Get current route (currently just showing home page)
  const currentRoute = routes.find(route => route.path === '/') || routes[0];
  const CurrentComponent = currentRoute.component;

  return (
    <div className="app">
      <CurrentComponent />
    </div>
  );
};

export default App;
