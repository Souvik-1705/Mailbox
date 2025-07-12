
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Welcome from './pages/Welcome';
import SendMail from './components/SendMail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path='/compose' element={<SendMail/>}/>
      </Routes>
    </Router>
  );
}

export default App;
