import './App.css';
import LoginPage from './pages/LoginPage';
import FirstLoginPage from './pages/FirstLoginPage';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div >
        <LoginPage />
      </div>
    </Provider>
  );
}

export default App;
