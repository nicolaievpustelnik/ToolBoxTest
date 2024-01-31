import React, { useState } from 'react';
import Tabla from './components/Tabla.js'

const App = () => {
  const [fileName, setFileName] = useState('');

  return (
    <div className="App" data-testid="app-component">
      <Tabla setFileName={setFileName} />
    </div>
  );
};

export default App;
