'use client';

import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

type Props = {
  languages: readonly { name: string; count: number }[];
};

export const GithubLanguagesChart = ({ languages }: Props) => {
  const theme = useTheme();
  const data = useMemo(() => {
    const top = [...languages].slice(0, 6);
    return top.map((lang, i) => ({
      id: lang.name,
      label: lang.name,
      value: lang.count,
      color: `hsl(${(i * 47) % 360}, 60%, 55%)`,
    }));
  }, [languages]);

  if (data.length === 0) {
    return (
      <div style={{ padding: '1rem 0', color: theme.palette.text.secondary }}>
        No language data yet.
      </div>
    );
  }

  return (
    <PieChart series={[{ data, innerRadius: 45, paddingAngle: 2, cornerRadius: 4 }]} height={220} />
  );
};
