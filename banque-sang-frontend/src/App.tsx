import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import ChatbotWidget from './components/ChatbotWidget';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ChatbotWidget />  {/* ⭐ Le widget est ici, donc visible partout */}
    </AuthProvider>
  );
}

export default App;
