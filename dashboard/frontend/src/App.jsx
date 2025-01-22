import { useState } from 'react';
import Display from './Table.jsx';
import IntroductionScreen from './LandingPage.jsx';
import ChartDisplay from './Chart.jsx';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('introduction-screen'); 

  const navigateTo = (screen) => {
    console.log(`Navigating to ${screen}`);
    setCurrentScreen(screen);
  };

  return (
    <div>
      <nav className="navbar">
        {/* Updated: Prevent page reload and use `navigateTo` properly */}
        <a href="#introduction-screen" onClick={(e) => navigateTo(e, 'introduction-screen')}>Introduction</a>
        <a href="#table-screen" onClick={(e) => navigateTo(e, 'table-screen')}>Table</a>
        <a href="#chart-questions" onClick={(e) => navigateTo(e, 'chart-questions')}>Charts</a>
      </nav>

    
      {currentScreen === 'introduction-screen' && <IntroductionScreen navigateTo={navigateTo} />}
      {currentScreen === 'table-screen' && <Display navigateTo={navigateTo} />}
      {currentScreen === 'chart-screen' && <ChartDisplay navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
