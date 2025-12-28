import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import { AppWalletProvider } from "./components/AppWalletProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <AppWalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppWalletProvider>
  )
}

export default App
