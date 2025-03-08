import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CorrelationDiagramList from './components/CorrelationDiagramList';
import CreateCorrelationDiagramList from './components/CreateCorrelationDiagramList';
import CorrelationDiagram from './components/CorrelationDiagram';
import Createnode from './components/CreateNode';
import CreateRelation from './components/CreateRelation';
import UpdateListName from './components/UpdateListName';
import CreateAI from './components/CreateAI';

function ProtectedRoute({ userId, children }) {
  if (!userId) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}

function App() {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    }
  }, [userId]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register setUserId={setUserId} />} />
        <Route path="/Login" element={<Login setUserId={setUserId} />} />
        <Route
          path="/CorrelationDiagramList"
          element={<ProtectedRoute userId={userId}><CorrelationDiagramList userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/CreateCorrelationDiagramList"
          element={<ProtectedRoute userId={userId}><CreateCorrelationDiagramList userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/CorrelationDiagram"
          element={<ProtectedRoute userId={userId}><CorrelationDiagram userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/CreateNode"
          element={<ProtectedRoute userId={userId}><Createnode userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/CreateRelation"
          element={<ProtectedRoute userId={userId}><CreateRelation userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/UpdateListName"
          element={<ProtectedRoute userId={userId}><UpdateListName userId={userId} /></ProtectedRoute>}
        />
        <Route
          path="/CreateAI"
          element={<ProtectedRoute userId={userId}><CreateAI userId={userId} /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
