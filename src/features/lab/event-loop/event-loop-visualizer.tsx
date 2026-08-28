'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { scenarios } from './scenarios';
import { runToIndex } from './reducer';
import styles from './event-loop.module.css';

export const EventLoopVisualizer = () => {
  const [scenarioId, setScenarioId] = useState(scenarios[0]!.id);
  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!,
    [scenarioId],
  );

  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(700);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when the scenario changes.
    setStepIndex(-1);
    setPlaying(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!playing) return undefined;
    if (stepIndex >= scenario.steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, scenario.steps.length - 1));
    }, speedMs);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, scenario.steps.length, speedMs]);

  const state = useMemo(() => runToIndex([...scenario.steps], stepIndex), [scenario, stepIndex]);

  const step = () => setStepIndex((i) => Math.min(i + 1, scenario.steps.length - 1));
  const reset = () => {
    setStepIndex(-1);
    setPlaying(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <Typography variant="overline" color="text.secondary">
            Scenario
          </Typography>
          <Select
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            size="small"
            className={styles.select}
          >
            {scenarios.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={styles.controls}>
          <IconButton
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={() => setPlaying((p) => !p)}
            color="primary"
          >
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton aria-label="Step forward" onClick={step}>
            <SkipNextIcon />
          </IconButton>
          <IconButton aria-label="Reset" onClick={reset}>
            <RestartAltIcon />
          </IconButton>
          <div className={styles.speed}>
            <Typography variant="caption" color="text.secondary">
              Speed
            </Typography>
            <Slider
              min={200}
              max={1500}
              step={100}
              value={speedMs}
              onChange={(_, v) => setSpeedMs(v as number)}
              valueLabelDisplay="off"
              size="small"
              className={styles.slider}
              aria-label="Playback speed"
            />
          </div>
        </div>
      </div>

      <Typography color="text.secondary" className={styles.description}>
        {scenario.description}
      </Typography>

      <div className={styles.gridArea}>
        <pre className={styles.code} aria-label="JavaScript source">
          <code>{scenario.code}</code>
        </pre>

        <div className={styles.columns}>
          <Column title="Call stack" items={state.stack.map((f) => f.label)} tone="stack" />
          <Column title="Web APIs" items={state.webApis.map((f) => f.label)} tone="webapi" />
          <Column
            title="Microtask queue"
            items={state.microtasks.map((f) => f.label)}
            tone="micro"
          />
          <Column title="Task queue" items={state.macrotasks.map((f) => f.label)} tone="macro" />
        </div>

        <div className={styles.side}>
          <div className={styles.note}>
            <Typography variant="overline" color="text.secondary">
              What just happened
            </Typography>
            <Typography>{state.note}</Typography>
          </div>
          <div className={styles.logs}>
            <Typography variant="overline" color="text.secondary">
              console output
            </Typography>
            <pre>
              <code>{state.logs.join('\n')}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          Step {stepIndex + 1} / {scenario.steps.length}
        </Typography>
        <Button variant="text" size="small" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

const Column = ({ title, items, tone }: { title: string; items: string[]; tone: string }) => (
  <div className={`${styles.column} ${styles[tone]}`}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <ul>
      {items.length === 0 ? (
        <li className={styles.empty}>empty</li>
      ) : (
        items.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)
      )}
    </ul>
  </div>
);
