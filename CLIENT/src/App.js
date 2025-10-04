// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// // Import our REAL page components with corrected paths
// import HomePage from './pages/HomePage';
// import RegisterPage from './pages/RegisterPage';
// import LoginPage from './pages/LoginPage';

// // Placeholders for pages we haven't built yet
// const DashboardPage = () => (
//   <div className="flex items-center justify-center h-screen">
//     <h1 className="text-4xl text-white">Dashboard Page</h1>
//   </div>
// );

// const EditorPage = () => (
//   <div className="flex items-center justify-center h-screen">
//     <h1 className="text-4xl text-white">Editor Page</h1>
//   </div>
// );

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black font-sans">
//       <Routes>
//         {/* Real components */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Placeholder pages */}
//         <Route path="/dashboard" element={<DashboardPage />} />
//         <Route path="/editor/:id" element={<EditorPage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// Import our REAL page components
// import HomePage from './pages/HomePage';
// import RegisterPage from './pages/RegisterPage';
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage'; // Import the real DashboardPage
// import ProtectedRoute from './components/layout/ProtectedRoute'; // Import the ProtectedRoute

// // This is a placeholder, you can create a real one later
// const EditorPage = () => (
//   <div className="flex items-center justify-center h-screen">
//     <h1 className="text-4xl text-white">Editor Page</h1>
//   </div>
// );

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black font-sans">
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Protected Routes */}
//         <Route path="/dashboard" element={<ProtectedRoute />}>
//           <Route index element={<DashboardPage />} />
//         </Route>
        
//         {/* You can also protect the editor route in the same way */}
//         <Route path="/editor/:id" element={<ProtectedRoute />}>
//           <Route index element={<EditorPage />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all of our real page components
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage'; // This is the update
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black font-sans">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* This route now uses the real EditorPage component */}
          <Route path="/editor/:id" element={<EditorPage />} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;

