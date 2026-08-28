import type { TerminalLine, TerminalSpan } from '../types';
import styles from './terminal.module.css';

const emphasisClass: Record<
  NonNullable<Extract<TerminalSpan, { type: 'text' }>['emphasis']>,
  string
> = {
  default: '',
  muted: styles.muted ?? '',
  accent: styles.accent ?? '',
  success: styles.success ?? '',
  warning: styles.warning ?? '',
  danger: styles.danger ?? '',
};

export const TerminalLineRenderer = ({ line }: { line: TerminalLine }) => (
  <div className={`${styles.line} ${line.kind === 'input' ? styles.lineInput : ''}`}>
    {line.spans.map((span, i) => {
      if (span.type === 'link') {
        return (
          <a
            key={i}
            href={span.href}
            className={styles.link}
            {...(span.external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
          >
            {span.label}
          </a>
        );
      }
      const cls = emphasisClass[span.emphasis ?? 'default'];
      return (
        <span key={i} className={cls}>
          {span.value}
        </span>
      );
    })}
  </div>
);
