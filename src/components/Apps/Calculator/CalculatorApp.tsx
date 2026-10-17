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

  return (
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Display */}
      <div className="p-4 flex flex-col justify-end items-end h-28 border-b border-slate-500/10 relative">
        <button
          onClick={() => setShowHistory(prev => !prev)}
          className={`absolute top-2 left-2 p-1.5 rounded transition-colors ${
            showHistory ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Cronologia calcoli"
        >
          <History className="w-4 h-4" />
        </button>

        <div className="text-xs text-slate-400 h-4 font-mono">
          {prevValue !== null ? `${prevValue} ${operation || ''}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-light font-mono truncate max-w-full tracking-tight">
          {display}
        </div>
      </div>

      {/* History Flyout */}
      {showHistory && (
        <div className={`p-3 border-b max-h-32 overflow-y-auto text-xs font-mono space-y-1 ${
          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 mb-1">
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
      <div className="flex-1 p-3 grid grid-cols-4 gap-1.5">
        <button
          onClick={clearAll}
          className={`rounded-lg font-medium text-xs sm:text-sm transition-colors ${
            isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-amber-700'
          }`}
        >
          C
        </button>
        <button
          onClick={deleteLast}
          className={`rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center ${
            isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => performOperation('%')}
          className={`rounded-lg font-medium text-xs sm:text-sm transition-colors ${
            isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-blue-600'
          }`}
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className="rounded-lg font-medium text-base bg-blue-600/90 hover:bg-blue-600 text-white transition-colors"
        >
          ÷
        </button>

        {/* 7 8 9 × */}
        {['7', '8', '9'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-lg font-medium text-base transition-colors ${
              isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/60'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('×')}
          className="rounded-lg font-medium text-base bg-blue-600/90 hover:bg-blue-600 text-white transition-colors"
        >
          ×
        </button>

        {/* 4 5 6 - */}
        {['4', '5', '6'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-lg font-medium text-base transition-colors ${
              isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/60'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('-')}
          className="rounded-lg font-medium text-base bg-blue-600/90 hover:bg-blue-600 text-white transition-colors"
        >
          -
        </button>

        {/* 1 2 3 + */}
        {['1', '2', '3'].map(d => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className={`rounded-lg font-medium text-base transition-colors ${
              isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/60'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('+')}
          className="rounded-lg font-medium text-base bg-blue-600/90 hover:bg-blue-600 text-white transition-colors"
        >
          +
        </button>

        {/* ± 0 . = */}
        <button
          onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(-val));
          }}
          className={`rounded-lg font-medium text-sm transition-colors ${
            isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
          }`}
        >
          ±
        </button>
        <button
          onClick={() => inputDigit('0')}
          className={`rounded-lg font-medium text-base transition-colors ${
            isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/60'
          }`}
        >
          0
        </button>
        <button
          onClick={inputDot}
          className={`rounded-lg font-medium text-base transition-colors ${
            isDark ? 'bg-slate-800/60 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
          }`}
        >
          .
        </button>
        <button
          onClick={calculateEquals}
          className="rounded-lg font-medium text-base bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
        >
          =
        </button>
      </div>
    </div>
  );
};
