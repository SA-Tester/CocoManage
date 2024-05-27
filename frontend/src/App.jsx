import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HelloWorld from "./HelloWorld";
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Attendance from './pages/Attendance.jsx';

export default function App() {
  return (
    // <div>
    //   {/* <HelloWorld /> */}
    //   <Attendance />
    // </div>
    <BrowserRouter>
      <Routes>
          <Route index element={<Attendance />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}