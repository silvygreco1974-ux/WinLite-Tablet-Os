import React, { useState } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';
import { useOS } from '../../../context/OSContext';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { settings } = useOS();
  const isDark = settings.theme === 'dark';

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteLast = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      if (operation === '+') newValue = currentValue + inputValue;
      else if (operation === '-') newValue = currentValue - inputValue;
      else if (operation === '×') newValue = currentValue * inputValue;
      else if (operation === '÷') newValue = inputValue !== 0 ? currentValue / inputValue : 0;
      else if (operation === '%') newValue = currentValue % inputValue;

      setHistory(prev => [`${currentValue} ${operation} ${inputValue} = ${newValue}`, ...prev.slice(0, 8)]);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const calculateEquals = () => {
    if (!operation || prevValue === null) return;
    const inputValue = parseFloat(display);
    let newValue = prevValue;

    if (operation === '+') newValue = prevValue + inputValue;
    else if (operation === '-') newValue = prevValue - inputValue;
    else if (operation === '×') newValue = prevValue * inputValue;
    else if (operation === '÷') newValue = inputValue !== 0 ? prevValue / inputValue : 0;
    else if (operation === '%') newValue = prevValue % inputValue;

    setHistory(prev => [`${prevValue} ${operation} ${inputValue} = ${newValue}`, ...prev.slice(0, 8)]);
    setDisplay(String(newValue));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const currentAccent = settings.accentColor || '#0078d4';

  return (
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1c212d] text-[#e2e8f0]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
      {/* Top Display */}
      <div className={`p-4 flex flex-col justify-end items-end h-28 border-b relative ${
        isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'
      }`}>
        <button
          onClick={() => setShowHistory(prev => !prev)}
          className={`absolute top-2 left-2 p-2 rounded-xl transition-colors ${
            showHistory ? 'text-blue-500 bg-blue-500/15' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Cronologia calcoli"
        >
          <History className="w-4 h-4" />
        </button>

        <div className="text-xs text-slate-400 h-4 font-mono">
          {prevValue !== null ? `${prevValue} ${operation || ''}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-normal font-mono truncate max-w-full tracking-tight">
          {display}
        </div>
      </div>

      {/* History Flyout */}
      {showHistory && (
        <div className={`p-3.5 border-b max-h-36 overflow-y-auto text-xs font-mono space-y-1 ${
          isDark ? 'bg-[#202532] border-[#364154] text-slate-200' : 'bg-[#f1f5f9] border-[#e2e8f0] text-slate-700'
        }`}>
          <div className="flex items-center justify-between text-xs font-sans text-slate-400 mb-1 font-semibold">
            <span>Cronologia</span>
            <button onClick={() => setHistory([])} className="hover:text-red-400">Pulisci</button>
          </div>
          {history.length === 0 ? (
            <div className="text-slate-500 italic py-1">Nessun calcolo recente</div>
          ) : (
            history.map((h, i) => <div key={i} className="truncate">{h}</div>)
          )}
        </div>
      )}

      {/* Keypad */}
      <div className="flex-1 p-3.5 grid grid-cols-4 gap-2">
        <button
          onClick={clearAll}
          className={`rounded-xl font-bold text-sm sm:text-base transition-colors ${
            isDark ? 'bg-[#242a38] hover:bg-[#2e3749] text-amber-400' : 'bg-[#f1f5f9] hover:bg-slate-200 text-amber-700'
          }`}
        >
          C
        </button>
        <button
          onClick={deleteLast}
          className={`rounded-xl font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${
            isDark ? 'bg-[#242a38] hover:bg-[#2e3749] text-slate-300' : 'bg-[#f1f5f9] hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => performOperation('%')}
          className={`rounded-xl font-bold text-sm sm:text-base transition-colors ${
            isDark ? 'bg-[#242a38] hover:bg-[#2e3749] text-blue-400' : 'bg-[#f1f5f9] hover:bg-slate-200 text-blue-600'
          }`}
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          style={{ backgroundColor: currentAccent }}
          className="rounded-xl font-bold text-xl text-white transition-opacity hover:opacity-90 shadow-xs"
        >
          ÷
        </button>

        {/* 7 8 9 × */}
        {['7', '8', '9'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-xl font-semibold text-lg sm:text-xl transition-all ${
              isDark
                ? 'bg-[#242a38] hover:bg-[#2f384b] text-[#f1f5f9] border border-[#364154]/50'
                : 'bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] shadow-xs'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('×')}
          style={{ backgroundColor: currentAccent }}
          className="rounded-xl font-bold text-xl text-white transition-opacity hover:opacity-90 shadow-xs"
        >
          ×
        </button>

        {/* 4 5 6 - */}
        {['4', '5', '6'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-xl font-semibold text-lg sm:text-xl transition-all ${
              isDark
                ? 'bg-[#242a38] hover:bg-[#2f384b] text-[#f1f5f9] border border-[#364154]/50'
                : 'bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] shadow-xs'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('-')}
          style={{ backgroundColor: currentAccent }}
          className="rounded-xl font-bold text-xl text-white transition-opacity hover:opacity-90 shadow-xs"
        >
          -
        </button>

        {/* 1 2 3 + */}
        {['1', '2', '3'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-xl font-semibold text-lg sm:text-xl transition-all ${
              isDark
                ? 'bg-[#242a38] hover:bg-[#2f384b] text-[#f1f5f9] border border-[#364154]/50'
                : 'bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] shadow-xs'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('+')}
          style={{ backgroundColor: currentAccent }}
          className="rounded-xl font-bold text-xl text-white transition-opacity hover:opacity-90 shadow-xs"
        >
          +
        </button>

        {/* ± 0 . = */}
        <button
          onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(-val));
          }}
          className={`rounded-xl font-semibold text-base transition-colors ${
            isDark ? 'bg-[#242a38] hover:bg-[#2e3749] text-slate-300' : 'bg-[#f1f5f9] hover:bg-slate-200 text-slate-700'
          }`}
        >
          ±
        </button>
        <button
          onClick={() => inputDigit('0')}
          className={`rounded-xl font-semibold text-lg sm:text-xl transition-all ${
            isDark
              ? 'bg-[#242a38] hover:bg-[#2f384b] text-[#f1f5f9] border border-[#364154]/50'
              : 'bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] shadow-xs'
          }`}
        >
          0
        </button>
        <button
          onClick={inputDot}
          className={`rounded-xl font-semibold text-lg sm:text-xl transition-all ${
            isDark
              ? 'bg-[#242a38] hover:bg-[#2f384b] text-[#f1f5f9] border border-[#364154]/50'
              : 'bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] shadow-xs'
          }`}
        >
          .
        </button>
        <button
          onClick={calculateEquals}
          style={{ backgroundColor: currentAccent }}
          className="rounded-xl font-bold text-xl text-white transition-opacity hover:opacity-90 shadow-md"
        >
          =
        </button>
      </div>
    </div>
  );
};
