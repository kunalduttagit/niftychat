import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" exact element={<HomePage />} />
                    <Route path="/chats" exact element={<ChatPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
