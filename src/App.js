import './App.css';
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CreateAccountPage from './pages/CreateAccountPage'
import Header from './components/Header'
import UploadPhotoPage from './pages/UploadPhotoPage';
import ApprovePhotosPage from './pages/ApprovePhotosPage';

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route Component={LoginPage} path='/login' />
        <Route exact path='/' element={<PrivateRoute />}>
          <Route exact path='/' element={<HomePage />} />
        </Route>
        <Route Component={CreateAccountPage} path='/register' />
        <Route Component={ApprovePhotosPage} path='/approve' />
        <Route Component={UploadPhotoPage} path='/upload' />
      </Routes>
    </div>
  );
}

export default App;
