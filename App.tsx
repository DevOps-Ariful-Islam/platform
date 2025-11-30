
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HierarchyTree } from './components/HierarchyTree';
import { ProjectTimeline } from './components/ProjectTimeline';
import { ModuleList } from './components/ModuleList';
import { Glossary } from './components/Glossary';
import { FullStackTree } from './components/FullStackTree';
import { DevOpsGuide } from './components/DevOpsGuide';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hierarchy" element={<HierarchyTree />} />
          <Route path="/structure" element={<FullStackTree />} />
          <Route path="/timeline" element={<ProjectTimeline />} />
          <Route path="/modules" element={<ModuleList />} />
          <Route path="/devops" element={<DevOpsGuide />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
