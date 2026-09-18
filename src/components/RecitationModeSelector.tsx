import React from 'react';
import { ReciteMode } from '../types';
import { ThemeConfig } from '../data/themes';

interface RecitationModeSelectorProps {
  mode: ReciteMode;
  onChangeMode: (mode: ReciteMode) => void;
  theme: ThemeConfig;
}

export const RecitationModeSelector: React.FC<RecitationModeSelectorProps> = ({
  mode,
  onChangeMode,
  theme,
}) => {
  const modes: { id: ReciteMode; labelZh: string; subLabel: string }[] = [
    { id: 'read', labelZh: '全显', subLabel: '阅读' },
    { id: 'cloze25', labelZh: '25%', subLabel: '轻度' },
    { id: 'cloze50', labelZh: '50%', subLabel: '进阶' },
    { id: 'cloze75', labelZh: '75%', subLabel: '深层' },
    { id: 'clozeAll', labelZh: '盲背', subLabel: '全隐' },
    { id: 'firstWord', labelZh: '首字', subLabel: '提示' },
  ];

  return (
    <div className={`w-full flex items-center justify-between p-1 rounded-xl border shadow-inner ${theme.modeSelectorBg}`}>
      {modes.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChangeMode(m.id)}
            className={`flex-1 py-1.5 px-1 rounded-lg text-center transition-all ${
              isActive ? theme.modeTabActive : theme.modeTabInactive
            }`}
          >
            <div className="text-xs font-semibold leading-tight">{m.labelZh}</div>
            <div className="text-[10px] opacity-75 leading-tight scale-90">{m.subLabel}</div>
          </button>
        );
      })}
    </div>
  );
};

