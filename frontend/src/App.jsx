import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HelloWorld from "./HelloWorld";
import Layout from "./pages/Layout.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Attendance from "./pages/Attendance.jsx";

const App = () => {
  return (
    // <div>
    //   {/* <HelloWorld /> */}
    //   <Attendance />
    // </div>
   
    <Router>
      <Layout>
        <Routes>
          <Route index element={<Attendance />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;