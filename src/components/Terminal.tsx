import React, { useState, useEffect, useRef } from 'react';

interface HistoryItem {
  type: 'cmd' | 'out' | 'err';
  content: string;
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'cmd', content: 'fleet --summary' },
    { type: 'out', content: 'corporate macOS  <span style="color:#6fcf97">17,000+</span>' },
    { type: 'out', content: 'BYOD macOS/Win   <span style="color:#6fcf97">15,000+</span>' },
    { type: 'out', content: 'Windows PCs      <span style="color:#6fcf97">450+</span>' },
    { type: 'out', content: 'CIS L2 coverage  <span style="color:#6fcf97">75%+</span>' },
    { type: 'out', content: ' ' },
    { type: 'cmd', content: 'compliance --check' },
    { type: 'out', content: ' ' },
    { type: 'out', content: '<span style="color:#6fcf97">✓ SOC2</span>  <span style="color:#6fcf97">✓ ZeroTrust</span>' },
    { type: 'out', content: '<span style="color:#6fcf97">✓ CIS L2</span> <span style="color:#6fcf97">✓ BYOD</span>' },
  ]);
  const [input, setInput] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim();
    let response = '';

    switch (cleanCmd) {
      case 'whoami':
        response = 'Saul Herman<br>Senior Client Platform Engineer (Ex-Atlassian).<br>Specializing in macOS/Windows fleet management and Zero Trust security.';
        break;
      case 'projects':
        response = '<b>Extraction Lab:</b> Professional coffee intelligence platform.<br><b>Tech:</b> Gemma 4 AI, Swift/SwiftUI, Live Activities, Dynamic Island.<br>URL: <a href="https://extractionlab.app" target="_blank" style="color:var(--accent)">extractionlab.app</a>';
        break;
      case 'skills':
        response = '<b>Platforms:</b> Jamf, Omnissa, Okta, Atlassian, Google Workspace<br><b>Languages:</b> Python, Bash, PowerShell, C++<br><b>Domains:</b> MDM, ZeroTrust, CIS Controls, SOC2, Onboarding Automation';
        break;
      case 'contact':
        response = 'Email: saulmherman@icloud.com<br>LinkedIn: linkedin.com/in/bettercallsaui<br>GitHub: github.com/thewaulicus';
        break;
      case 'help':
        response = 'Available commands:<br> - whoami: Brief bio<br> - projects: Recent work<br> - skills: Technical skillset<br> - contact: Get in touch<br> - clear: Clear the terminal window<br> - help: Show this message';
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        setHistory(prev => [...prev, { type: 'err', content: `Command not found: ${cleanCmd}. Type 'help' for a list of available commands.` }]);
        return;
    }

    setHistory(prev => [...prev, { type: 'out', content: response }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [...prev, { type: 'cmd', content: input }]);
    handleCommand(input);
    setInput('');
  };

  return (
    <div 
      className="terminal-container glass" 
      onClick={() => inputRef.current?.focus()}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '2rem auto',
        overflow: 'hidden',
        fontFamily: "'DM Mono', monospace",
        fontSize: '13px',
      }}
    >
      <div className="terminal-bar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '0.5rem', letterSpacing: '0.06em' }}>
          saul@local ~ fleet-status
        </span>
      </div>
      <div 
        ref={terminalBodyRef}
        className="terminal-body" 
        style={{
          padding: '1.25rem',
          height: '300px',
          overflowY: 'auto',
          lineHeight: '1.8',
        }}
      >
        {history.map((item, i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            {item.type === 'cmd' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>$</span>
                <span style={{ color: 'var(--accent)' }}>{item.content}</span>
              </div>
            ) : (
              <div 
                style={{ color: item.type === 'err' ? '#ff5f57' : 'var(--sub)' }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)' }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--accent)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              width: '100%',
              padding: 0,
            }}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
