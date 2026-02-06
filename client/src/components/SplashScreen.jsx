import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/logo.png';

const SplashScreen = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Requirements: Total animation not exceeding 800ms.
        // 600ms display + 200ms fadeout = 800ms total.
        const showTimer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                onComplete();
            }, 200);
        }, 600);

        return () => clearTimeout(showTimer);
    }, [onComplete]);

    return (
        <div className={`simple-splash-overlay ${fadeOut ? 'exit' : ''}`}>
            <div className="simple-splash-content">
                <img src={logo} alt="Etukas" className="simple-splash-logo" />
            </div>
        </div>
    );
};

export default SplashScreen;
