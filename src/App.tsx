import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { OverviewPage } from '@/pages/OverviewPage';
import { RecoveryPage } from '@/pages/RecoveryPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { SQLExplorerPage } from '@/pages/SQLExplorerPage';
import { ExperimentsPage } from '@/pages/ExperimentsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/recovery" element={<RecoveryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/sql" element={<SQLExplorerPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:id" element={<ExperimentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
