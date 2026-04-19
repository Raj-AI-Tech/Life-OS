import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import logo from "./assets/LifeOS.png";

// UTILS IMPORT 
import { THEMES } from "./theme/theme";
import { useLS } from "./hooks/useLS";
import { NAV } from "./constants";
import Sidebar from "./components/layout/Sidebar";
import { HABIT_DEFAULTS } from "./constants";

// PAGES IMPORT
import HomeDashboard from "./pages/Dashboard";
import TaskSystem from "./pages/TaskSystem";
import HabitTracker from "./pages/HabitTracker";
import GoalSystem from "./pages/GoalSystem";
import Analytics from "./pages/Analytics";
import NoteVault from "./pages/NoteVault";
import FocusMode from "./pages/FocusMode";
import DistractionControl from "./pages/DistractionControl";
import CalendarPlanning from "./pages/CalendarPlanning";
import LifeTrackers from "./pages/LifeTrackers";
import ContentCreator from "./pages/ContentCreator";
import Settings from "./pages/Settings";


export default function App() {
  const [theme, setTheme]             = useLS("los_theme", "emerald");
  const [page, setPage]               = useLS("los_page", "home");
  const [tasks, setTasks]             = useLS("los_tasks", []);
  const [habits, setHabits]           = useLS("los_habits", HABIT_DEFAULTS.map((n,i)=>({ id:i+1, name:n, history:{}, streak:0 })));
  const [goals, setGoals]             = useLS("los_goals", []);
  const [notes, setNotes]             = useLS("los_notes", []);
  const [focusSessions, setFocusSessions] = useLS("los_focus", []);
  const [distractions, setDistractions]   = useLS("los_distractions", []);
  const [lifeLogs, setLifeLogs]       = useLS("los_lifelogs", []);
  const [content, setContent]         = useLS("los_content", []);
  const [collapsed, setCollapsed]     = useState(false);
  const [mobOpen, setMobOpen]         = useState(false);

  const t = THEMES[theme] || THEMES.emerald;

  const cssVars = {
    "--bg":          t.bg,
    "--surface":     t.surface,
    "--card":        t.card,
    "--cardHover":   t.cardHover,
    "--border":      t.border,
    "--borderLight": t.borderLight,
    "--accent":      t.accent,
    "--accentDim":   t.accentDim,
    "--accentText":  t.accentText,
    "--text":        t.text,
    "--textMuted":   t.textMuted,
    "--textDim":     t.textDim,
    "--green":       t.green,
    "--greenDim":    t.greenDim,
    "--red":         t.red,
    "--redDim":      t.redDim,
    "--amber":       t.amber,
    "--amberDim":    t.amberDim,
    "--blue":        t.blue,
    "--blueDim":     t.blueDim,
    "--gold":        t.gold,
    "--inputBg":     t.inputBg,
    "--sidebarBg":   t.sidebarBg,
    "--meshA":       t.meshA,
    "--meshB":       t.meshB,
    "--meshC":       t.meshC,
    "--glowAccent":  t.glowAccent,
    "--cardGlow":    t.cardGlow,
  };

  const sidebarWidth = collapsed ? 60 : 230;

  const shared = {
    tasks, setTasks, habits, setHabits, goals, setGoals,
    notes, setNotes, focusSessions, setFocusSessions,
    distractions, setDistractions, lifeLogs, setLifeLogs,
    content, setContent, theme: t, setPage,
  };

  const closeMob = () => setMobOpen(false);

  return (
    <div
      className="app-root"
      style={{
        ...cssVars,
        display: "flex", height: "100vh",
        background: "var(--bg)", color: "var(--text)",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      

      {/* ── MOBILE OVERLAY BACKDROP ── */}
      <div
        className={`mob-overlay${mobOpen ? " mob-open" : ""}`}
        onClick={closeMob}
      />

      {/* ── SIDEBAR SHELL (handles mobile slide + desktop width) ── */}
      <div
        className={`sidebar-shell${mobOpen ? " mob-open" : ""}`}
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          page={page} setPage={setPage}
          theme={theme} setTheme={setTheme}
          collapsed={collapsed} setCollapsed={setCollapsed}
          onNavClick={closeMob}
        />
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Mobile topbar — fixed, shown only on ≤768px via CSS */}
        <div className="mob-topbar">
          <button
            onClick={() => setMobOpen(v => !v)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "7px 10px", color: "var(--text)",
              cursor: "pointer", fontSize: 16, lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img 
              src={logo} 
              alt="logo"
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                objectFit: "cover",

                animation: "glowPulse 2.5s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "0.06em" }}>LIFE OS</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--textMuted)", marginLeft: "auto" }}>
            {NAV.find(n => n.id === page)?.label}
          </span>
        </div>

        {/* Content */}
        <main className="main-content-pad" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
            {page==="home"        && <HomeDashboard   {...shared} />}
            {page==="tasks"       && <TaskSystem       {...shared} />}
            {page==="habits"      && <HabitTracker     {...shared} />}
            {page==="goals"       && <GoalSystem        {...shared} />}
            {page==="analytics"   && <Analytics         {...shared} />}
            {page==="notes"       && <NoteVault         {...shared} />}
            {page==="focus"       && <FocusMode         {...shared} />}
            {page==="distraction" && <DistractionControl {...shared} />}
            {page==="calendar"    && <CalendarPlanning  {...shared} />}
            {page==="trackers"    && <LifeTrackers       {...shared} />}
            {page==="content"     && <ContentCreator    {...shared} />}
            {page==="settings"    && <Settings theme={theme} setTheme={setTheme} tasks={tasks} habits={habits} goals={goals} notes={notes} />}
          </div>
        </main>
      </div>
    </div>
  );
}
