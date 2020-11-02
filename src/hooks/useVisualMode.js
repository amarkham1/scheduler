import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      let allButLast = history.slice(0, history.length - 1);
      setHistory([...allButLast, newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);

    }
    setMode(newMode);
  }

  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      let allButLast = history.slice(0, history.length - 1);
      setHistory(allButLast);
    }
  }

  return { mode, transition, back };
}