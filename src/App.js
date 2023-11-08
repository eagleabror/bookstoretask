import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import BookList from './components/BookList';
import { useSelector } from 'react-redux';
import NotFound from './components/NotFound';

const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
  if (isAllowed == false) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const {loggedIn} = useSelector(state => state.auth)
  return (
    <>
      {/* <BookList /> */}
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/panel"
          element={
            <ProtectedRoute
              isAllowed={loggedIn}
            >
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
