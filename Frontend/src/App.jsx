import { Route,Routes } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage';
import Notifications from './pages/Notifications';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';

import toast, {Toaster} from 'react-hot-toast';




const App = () => {
  return (
    <div className=' h-screen' data-theme="night">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/onboarding' element={<OnboardingPage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/call' element={<CallPage />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
