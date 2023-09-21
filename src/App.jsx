import { useAuth0 } from "@auth0/auth0-react";
import './App.css';

function App() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
      <div className='conver-image'>
        <h1 className='cover-heading'>
          People gallery
        </h1>
        <p>your last stop when saving your images</p>
        <button onClick={() => loginWithRedirect()} className='cover-btn'>
          Enter
        </button>
      </div>
      </header>
    </div>
  );
}

export default App;
