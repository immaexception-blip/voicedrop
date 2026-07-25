import React from 'react';
import { useApp } from '../context/AppContext';

export default function MobileDeviceFrame({ children }) {
  const { deviceFrame, themeMode } = useApp();

  return (
    <div className="app-wrapper" data-theme={themeMode}>
      <div className={`device-container mode-${deviceFrame}`}>
        {/* iOS Dynamic Island */}
        {deviceFrame === 'ios' && (
          <div className="ios-island">
            <div className="ios-island-camera" />
          </div>
        )}

        {/* Android Camera Hole Punch */}
        {deviceFrame === 'android' && (
          <div className="android-notch" />
        )}

        {children}
      </div>
    </div>
  );
}
