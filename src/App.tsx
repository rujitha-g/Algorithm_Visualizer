import { AppProvider } from './context/AppContext';
import VisualizerPage from './pages/VisualizerPage';

function App() {
  return (
    <AppProvider>
      <VisualizerPage />
    </AppProvider>
  );
}

export default App;
