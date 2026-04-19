import { useLS } from "../hooks/useLS";
import { HABIT_DEFAULTS } from "../constants";

 
export function useAppStore() {
  const [tasks, setTasks]                     = useLS("los_tasks", []);
  const [habits, setHabits]                   = useLS("los_habits", HABIT_DEFAULTS.map((n,i) => ({ id:i+1, name:n, history:{}, streak:0 })));
  const [goals, setGoals]                     = useLS("los_goals", []);
  const [notes, setNotes]                     = useLS("los_notes", []);
  const [focusSessions, setFocusSessions]     = useLS("los_focus", []);
  const [distractions, setDistractions]       = useLS("los_distractions", []);
  const [lifeLogs, setLifeLogs]               = useLS("los_lifelogs", []);
  const [content, setContent]                 = useLS("los_content", []);
 
  return {
    tasks, setTasks,
    habits, setHabits,
    goals, setGoals,
    notes, setNotes,
    focusSessions, setFocusSessions,
    distractions, setDistractions,
    lifeLogs, setLifeLogs,
    content, setContent,
  };
}