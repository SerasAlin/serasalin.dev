'use client';

import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import cronstrue from 'cronstrue';
import { format } from 'date-fns';
import { parseCron, nextExecutions } from './cron';
import styles from './cron-explorer.module.css';

export const CronExplorer = () => {
  const [expression, setExpression] = useState('*/15 9-17 * * 1-5');

  const parsed = useMemo(() => {
    try {
      const spec = parseCron(expression);
      const description = cronstrue.toString(expression, { throwExceptionOnParseError: true });
      const runs = nextExecutions(spec, new Date(), 6);
      return { ok: true as const, description, runs };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : 'Invalid expression',
      };
    }
  }, [expression]);

  return (
    <div className={styles.wrapper}>
      <TextField
        label="Cron expression"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="* * * * *"
        fullWidth
        slotProps={{ input: { className: styles.input } }}
        helperText="Five fields: minute hour day-of-month month day-of-week."
      />
      {parsed.ok ? (
        <>
          <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
            {parsed.description}
          </Alert>
          <Typography variant="overline" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Next executions
          </Typography>
          <ol className={styles.runs}>
            {parsed.runs.map((run) => (
              <li key={run.toISOString()}>
                <span className={styles.iso}>{run.toISOString()}</span>
                <span className={styles.pretty}>{format(run, 'EEE d MMM yyyy · HH:mm')}</span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {parsed.error}
        </Alert>
      )}
    </div>
  );
};
