import React from "react";
import './App.css';

function IntroductionScreen({ navigateTo }) {
    const tableDisplay = () => {
        console.log('Table Button clicked!');
        navigateTo('table-screen'); 
    };
    const chartDisplay = () => {
        console.log('Chart Button clicked!');
        navigateTo('chart-screen'); 
    };
    return (
        <div className="intro-page">
            <div className="overlay-content-welcome">
                <h1> CARGO TRACKER SOULTIONS</h1>
                <p> Pick your preferred visualization below to get started!</p>
            </div>

            <button className="game-setup-button" onClick={tableDisplay}>
                <div className="overlay-content-gamesetup1">
                    <h1>View Tables</h1>
                </div>
            </button>
            <button className="game-setup-button" onClick={chartDisplay}>
                <div className="overlay-content-gamesetup2">
                    <h1>View Charts</h1>
                </div>
            </button>
        </div>
    );
}

export default IntroductionScreen;