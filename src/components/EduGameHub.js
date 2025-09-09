import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Play, Pause, RotateCcw, Zap, Atom, Calculator, Dna, Moon, Sun, Home, User, Settings, Trophy, Users, BarChart3, Clock, Target } from 'lucide-react';

// Custom CSS styles embedded in the component
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.5;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    transition: all 0.3s ease;
    position: relative;
  }

  .app.light {
    background: #ffffff;
    color: #1f2937;
  }

  .app.dark {
    background: #1e3a8a;
    color: #f8fafc;
  }

  .app::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: -1;
  }

  .mouse-trail {
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
  }

  .dashboard-container {
    display: flex;
    min-height: 100vh;
    backdrop-filter: blur(10px);
  }

  .sidebar {
    width: 280px;
    padding: 24px 0;
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .sidebar.light {
    background-color: #ffffff;
    border-right-color: rgba(0, 0, 0, 0.1);
  }

  .sidebar.dark {
    background-color: #1e3a8a;
    border-right-color: rgba(255, 255, 255, 0.1);
  }

  .logo-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
    margin-bottom: 32px;
  }

  .logo-icon {
    background: linear-gradient(45deg, #f59e0b, #f97316);
    padding: 12px;
    border-radius: 16px;
    margin-right: 12px;
    color: white;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  }

  .logo-text {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(45deg, #f59e0b, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-button {
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 16px;
    font-weight: 600;
    width: 100%;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .nav-button.light {
    color: #374151;
  }

  .nav-button.dark {
    color: #e5e7eb;
  }

  .nav-button:hover.light {
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateX(4px);
  }

  .nav-button:hover.dark {
    background-color: rgba(59, 130, 246, 0.2);
    transform: translateX(4px);
  }

  .nav-button.active.light {
    background: linear-gradient(45deg, #3b82f6, #6366f1);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }

  .nav-button.active.dark {
    background: linear-gradient(45deg, #1d4ed8, #4338ca);
    color: white;
    box-shadow: 0 4px 15px rgba(29, 78, 216, 0.4);
  }

  .nav-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    transition: all 0.3s ease;
  }

  .nav-icon.light {
    background-color: rgba(243, 244, 246, 0.8);
  }

  .nav-icon.dark {
    background-color: rgba(75, 85, 99, 0.8);
  }

  .main-content {
    flex: 1;
    padding: 32px;
    backdrop-filter: blur(10px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .theme-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .theme-toggle.light {
    color: #374151;
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }

  .theme-toggle.dark {
    color: #f3f4f6;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
  }

  .theme-toggle:hover {
    transform: scale(1.1) rotate(15deg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stats-card {
    border-radius: 24px;
    padding: 24px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .stats-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .stats-card.total-score {
    background: #f4ab6a;
  }

  .stats-card.study-streak {
    background: #c4ad9d;
  }

  .stats-icon {
    width: 64px;
    height: 64px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .subjects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .subject-card {
    border-radius: 24px;
    padding: 24px;
    color: white;
    cursor: pointer;
    transform: translateY(0);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .subject-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transition: all 0.6s ease;
    transform: scale(0);
  }

  .subject-card:hover::before {
    transform: scale(1);
  }

  .subject-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  .subject-card.physics {
    background: #86cbed;
  }

  .subject-card.chemistry {
    background: #caadff;
  }

  .subject-card.math {
    background: #ece75f;
  }

  .subject-card.biology {
    background: #9fd4a3;
  }

  .subject-card.analytics {
    background: #ffadc7;
  }

  .progress-bar {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    height: 8px;
    overflow: hidden;
    margin-top: 16px;
    backdrop-filter: blur(5px);
  }

  .progress-fill {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1));
    height: 8px;
    border-radius: 10px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
  }

  .game-container {
    border-radius: 24px;
    padding: 32px;
    margin-top: 24px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .game-container.light {
    background: rgba(255, 255, 255, 0.95);
    color: #1f2937;
  }

  .game-container.dark {
    background: rgba(30, 41, 59, 0.95);
    color: #f8fafc;
  }

  .canvas {
    width: 100%;
    border-radius: 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    margin: 16px 0;
    backdrop-filter: blur(5px);
  }

  .controls {
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 16px 0;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 12px 16px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .slider {
    width: 150px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    cursor: pointer;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3b82f6, #6366f1);
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
  }

  .action-button {
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .action-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .action-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .action-button.primary {
    background: linear-gradient(45deg, #3b82f6, #6366f1);
  }

  .action-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  .action-button.secondary {
    background: linear-gradient(45deg, #6b7280, #4b5563);
  }

  .action-button.secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
  }

  .action-button.danger {
    background: linear-gradient(45deg, #ef4444, #dc2626);
  }

  .action-button.danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  .molecule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 16px;
    margin: 16px 0;
  }

  .molecule-button {
    aspect-ratio: 1;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
  }

  .molecule-button:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  .molecule-button.selected {
    border-color: #3b82f6;
    background: linear-gradient(45deg, #3b82f6, #6366f1);
    color: white;
    transform: scale(1.1);
  }

  .dna-base {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .dna-base:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .dna-base.A {
    background: linear-gradient(45deg, #ef4444, #dc2626);
  }

  .dna-base.T {
    background: linear-gradient(45deg, #3b82f6, #2563eb);
  }

  .dna-base.G {
    background: linear-gradient(45deg, #10b981, #059669);
  }

  .dna-base.C {
    background: linear-gradient(45deg, #f59e0b, #d97706);
  }

  .dna-sequence {
    display: flex;
    gap: 8px;
    margin: 12px 0;
    align-items: center;
    justify-content: center;
  }

  .equation-input {
    padding: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    font-size: 24px;
    text-align: center;
    margin: 0 8px;
    width: 100px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    transition: all 0.3s ease;
  }

  .equation-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    transform: scale(1.05);
  }

  .score-display {
    background: linear-gradient(45deg, #10b981, #059669);
    color: white;
    padding: 20px;
    border-radius: 16px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin: 16px 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }

  .student-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
  }

  .student-card.dark {
    background: rgba(30, 41, 59, 0.95);
    color: #f8fafc;
  }

  .student-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  .student-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3b82f6, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 24px;
    margin: 0 auto 16px;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      padding: 16px;
    }
    
    .main-content {
      padding: 16px;
    }
    
    .stats-grid,
    .subjects-grid,
    .analytics-grid {
      grid-template-columns: 1fr;
    }
    
    .controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .control-group {
      justify-content: center;
    }
  }
`;

const EduGameHub = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const canvasRef = useRef(null);
  const mouseTrailRef = useRef(null);
  const [score, setScore] = useState(1250);
  const [streak, setStreak] = useState(7);

  // Physics Game State
  const [physicsRunning, setPhysicsRunning] = useState(false);
  const [gravity, setGravity] = useState(9.8);
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);

  // Chemistry Game State
  const [selectedMolecules, setSelectedMolecules] = useState([]);
  const [reactionResult, setReactionResult] = useState('');

  // Math Game State
  const [mathProblem, setMathProblem] = useState({ a: 5, b: 3, operation: '+', answer: '' });
  const [mathScore, setMathScore] = useState(0);

  // Biology Game State
  const [dnaSequence, setDnaSequence] = useState(['A', 'T', 'G', 'C']);
  const [complementSequence, setComplementSequence] = useState(['', '', '', '']);
  const [dnaScore, setDnaScore] = useState(0);

  // Analytics Data
  const [students] = useState([
    { id: 1, name: 'Alex Johnson', score: 850, physics: 78, chemistry: 82, math: 90, biology: 75, lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Wilson', score: 920, physics: 85, chemistry: 88, math: 92, biology: 80, lastActive: '1 hour ago' },
    { id: 3, name: 'Mike Chen', score: 760, physics: 70, chemistry: 75, math: 85, biology: 68, lastActive: '4 hours ago' },
    { id: 4, name: 'Emma Davis', score: 1100, physics: 95, chemistry: 90, math: 88, biology: 92, lastActive: '30 mins ago' },
    { id: 5, name: 'David Brown', score: 680, physics: 65, chemistry: 70, math: 72, biology: 60, lastActive: '1 day ago' },
    { id: 6, name: 'Lisa Garcia', score: 950, physics: 88, chemistry: 85, math: 94, biology: 87, lastActive: '3 hours ago' },
  ]);

  useEffect(() => {
    // Add styles to document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Mouse trail effect
    const handleMouseMove = (e) => {
      if (mouseTrailRef.current) {
        mouseTrailRef.current.style.left = e.clientX - 10 + 'px';
        mouseTrailRef.current.style.top = e.clientY - 10 + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.head.removeChild(styleSheet);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Physics Game Logic
  useEffect(() => {
    if (!physicsRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate projectile motion
      const vx = velocity * Math.cos(angle * Math.PI / 180);
      const vy = velocity * Math.sin(angle * Math.PI / 180);
      
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      
      if (y < 0) {
        setPhysicsRunning(false);
        return;
      }
      
      // Draw projectile with glow effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x * 8 + 50, canvas.height - y * 8 - 50, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw trajectory
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= t; i += 0.1) {
        const px = vx * i * 8 + 50;
        const py = canvas.height - (vy * i - 0.5 * gravity * i * i) * 8 - 50;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      
      t += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [physicsRunning, gravity, velocity, angle]);

  const resetPhysics = () => {
    setPhysicsRunning(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Chemistry Game Logic
  const molecules = [
    { name: 'H₂O', formula: 'H2O', color: '#3b82f6' },
    { name: 'CO₂', formula: 'CO2', color: '#6b7280' },
    { name: 'NaCl', formula: 'NaCl', color: '#f59e0b' },
    { name: 'O₂', formula: 'O2', color: '#ef4444' },
    { name: 'H₂', formula: 'H2', color: '#10b981' },
    { name: 'CH₄', formula: 'CH4', color: '#8b5cf6' },
  ];

  const handleMoleculeSelect = (molecule) => {
    setSelectedMolecules(prev => {
      const newSelection = [...prev, molecule];
      if (newSelection.length >= 2) {
        simulateReaction(newSelection);
        return [];
      }
      return newSelection;
    });
  };

  const simulateReaction = (molecules) => {
    const reactions = {
      'H2,O2': '2H₂ + O₂ → 2H₂O (Water formation) 💧',
      'H2O,CO2': 'H₂O + CO₂ → H₂CO₃ (Carbonic acid formation) 🌊',
      'CH4,O2': 'CH₄ + 2O₂ → CO₂ + 2H₂O (Combustion reaction) 🔥',
      'NaCl,H2O': 'NaCl + H₂O → Na⁺ + Cl⁻ + H₂O (Dissolution) 🧂',
    };

    const key = molecules.map(m => m.formula).sort().join(',');
    const result = reactions[key] || 'No reaction occurs between these molecules 🤔';
    setReactionResult(result);
  };

  // Math Game Logic
  const generateMathProblem = () => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    
    if (operation === '÷') {
      a = a * b; // Ensure clean division
    }
    
    setMathProblem({ a, b, operation, answer: '' });
  };

  const checkMathAnswer = () => {
    const { a, b, operation, answer } = mathProblem;
    let correct = 0;
    
    switch (operation) {
      case '+': correct = a + b; break;
      case '-': correct = a - b; break;
      case '×': correct = a * b; break;
      case '÷': correct = a / b; break;
    }
    
    if (parseInt(answer) === correct) {
      setMathScore(prev => prev + 10);
      generateMathProblem();
      setScore(prev => prev + 10);
    } else {
      alert(`Incorrect! The answer is ${correct}`);
    }
  };

  // Biology Game Logic
  const dnaComplements = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };

  const handleDnaBaseClick = (base, index) => {
    const complement = dnaComplements[base];
    setComplementSequence(prev => {
      const newSeq = [...prev];
      newSeq[index] = complement;
      return newSeq;
    });
  };

  const checkDnaSequence = () => {
    const correct = dnaSequence.every((base, index) => 
      complementSequence[index] === dnaComplements[base]
    );
    
    if (correct) {
      setDnaScore(prev => prev + 20);
      setScore(prev => prev + 20);
      // Generate new sequence
      const bases = ['A', 'T', 'G', 'C'];
      const newSequence = Array.from({ length: 4 }, () => 
        bases[Math.floor(Math.random() * bases.length)]
      );
      setDnaSequence(newSequence);
      setComplementSequence(['', '', '', '']);
    } else {
      alert('Incorrect sequence! Try again.');
    }
  };

  useEffect(() => {
    generateMathProblem();
  }, []);

  const renderDashboard = () => (
    <div>
      <div className="stats-grid">
        <div className="stats-card total-score">
          <div>
            <h3>Total Score</h3>
            <h2 style={{fontSize: '36px', fontWeight: 'bold'}}>{score}</h2>
            <p>+125 this week</p>
          </div>
          <div className="stats-icon">
            <Trophy size={32} />
          </div>
        </div>
        <div className="stats-card study-streak">
          <div>
            <h3>Study Streak</h3>
            <h2 style={{fontSize: '36px', fontWeight: 'bold'}}>{streak} days</h2>
            <p>Keep it up, Ekarna!</p>
          </div>
          <div className="stats-icon">
            <Zap size={32} />
          </div>
        </div>
      </div>

      <div className="subjects-grid">
        <div className="subject-card physics" onClick={() => setCurrentView('physics')}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
            <div>
              <h3>Physics</h3>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: '8px 0'}}>Level 3</p>
              <p>Projectile Motion</p>
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>⚡</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '65%'}}></div>
          </div>
        </div>

        <div className="subject-card chemistry" onClick={() => setCurrentView('chemistry')}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
            <div>
              <h3>Chemistry</h3>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: '8px 0'}}>Level 2</p>
              <p>Reactions</p>
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>⚗</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '45%'}}></div>
          </div>
        </div>

        <div className="subject-card math" onClick={() => setCurrentView('math')}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
            <div>
              <h3 style={{color: '#000'}}>Mathematics</h3>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: '8px 0', color: '#000'}}>Level 4</p>
              <p style={{color: '#333'}}>Algebra & More</p>
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>🔢</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '80%'}}></div>
          </div>
        </div>

        <div className="subject-card biology" onClick={() => setCurrentView('biology')}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
            <div>
              <h3>Biology</h3>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: '8px 0'}}>Level 3</p>
              <p>DNA Replication</p>
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>🧬</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <div className="stats-grid">
        <div className="stats-card analytics">
          <div>
            <h3>Total Students</h3>
            <h2 style={{fontSize: '36px', fontWeight: 'bold'}}>{students.length}</h2>
            <p>Active learners</p>
          </div>
          <div className="stats-icon">
            <Users size={32} />
          </div>
        </div>
        
        <div className="stats-card analytics">
          <div>
            <h3>Average Score</h3>
            <h2 style={{fontSize: '36px', fontWeight: 'bold'}}>
              {Math.round(students.reduce((sum, student) => sum + student.score, 0) / students.length)}
            </h2>
            <p>Class performance</p>
          </div>
          <div className="stats-icon">
            <BarChart3 size={32} />
          </div>
        </div>
        
        <div className="stats-card analytics">
          <div>
            <h3>Active Today</h3>
            <h2 style={{fontSize: '36px', fontWeight: 'bold'}}>
              {students.filter(s => s.lastActive.includes('hour') || s.lastActive.includes('min')).length}
            </h2>
            <p>Students online</p>
          </div>
          <div className="stats-icon">
            <Clock size={32} />
          </div>
        </div>
        
        <div className="stats-card analytics">
          <div>
            <h3>Top Performer</h3>
            <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>
              {students.reduce((top, student) => student.score > top.score ? student : top, students[0]).name}
            </h2>
            <p>{students.reduce((top, student) => student.score > top.score ? student : top, students[0]).score} points</p>
          </div>
          <div className="stats-icon">
            <Target size={32} />
          </div>
        </div>
      </div>

      <h2 style={{margin: '32px 0 24px 0', fontSize: '28px', fontWeight: 'bold'}}>Student Performance</h2>
      <div className="analytics-grid">
        {students.map(student => (
          <div key={student.id} className={`student-card ${darkMode ? 'dark' : ''}`}>
            <div className="student-avatar">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 style={{textAlign: 'center', marginBottom: '12px', fontSize: '18px', fontWeight: 'bold'}}>
              {student.name}
            </h3>
            <div style={{textAlign: 'center', marginBottom: '16px'}}>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px'}}>
                {student.score} pts
              </div>
              <div style={{fontSize: '12px', opacity: 0.7}}>
                Last active: {student.lastActive}
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px'}}>
              <div>
                <div style={{fontWeight: '600'}}>Physics</div>
                <div style={{color: '#3b82f6'}}>{student.physics}%</div>
              </div>
              <div>
                <div style={{fontWeight: '600'}}>Chemistry</div>
                <div style={{color: '#10b981'}}>{student.chemistry}%</div>
              </div>
              <div>
                <div style={{fontWeight: '600'}}>Math</div>
                <div style={{color: '#8b5cf6'}}>{student.math}%</div>
              </div>
              <div>
                <div style={{fontWeight: '600'}}>Biology</div>
                <div style={{color: '#f59e0b'}}>{student.biology}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhysicsGame = () => (
    <div className={`game-container ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Zap size={28} />
        Physics: Projectile Motion Simulator
      </h2>

      <canvas 
        ref={canvasRef}
        className="canvas"
        width={800}
        height={400}
        style={{backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 0.8)'}}
      />

      <div className="controls">
        <div className="control-group">
          <label style={{fontWeight: '600'}}>Gravity: {gravity} m/s²</label>
          <input
            type="range"
            min="1"
            max="20"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
        
        <div className="control-group">
          <label style={{fontWeight: '600'}}>Velocity: {velocity} m/s</label>
          <input
            type="range"
            min="5"
            max="50"
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
        
        <div className="control-group">
          <label style={{fontWeight: '600'}}>Angle: {angle}°</label>
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="controls">
        <button 
          className={`action-button ${physicsRunning ? 'danger' : 'primary'}`}
          onClick={() => setPhysicsRunning(!physicsRunning)}
        >
          {physicsRunning ? <Pause size={20} /> : <Play size={20} />}
          {physicsRunning ? 'Stop' : 'Launch'}
        </button>
        
        <button className="action-button secondary" onClick={resetPhysics}>
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );

  const renderChemistryGame = () => (
    <div className={`game-container ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Atom size={28} />
        Chemistry: Reaction Simulator
      </h2>

      <p style={{marginBottom: '16px', fontSize: '16px'}}>
        Select two molecules to see their reaction:
      </p>

      <div className="molecule-grid">
        {molecules.map((molecule, index) => (
          <div
            key={index}
            className={`molecule-button ${selectedMolecules.includes(molecule) ? 'selected' : ''}`}
            onClick={() => handleMoleculeSelect(molecule)}
          >
            <div style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '4px'}}>
              {molecule.name}
            </div>
            <div style={{fontSize: '12px', opacity: 0.8}}>
              {molecule.formula}
            </div>
          </div>
        ))}
      </div>

      {selectedMolecules.length > 0 && (
        <div style={{marginTop: '16px', textAlign: 'center'}}>
          <h4 style={{fontSize: '18px', fontWeight: '600'}}>
            Selected: {selectedMolecules.map(m => m.name).join(' + ')}
          </h4>
        </div>
      )}

      {reactionResult && (
        <div className="score-display">
          <h3 style={{fontSize: '20px', marginBottom: '8px'}}>Reaction Result:</h3>
          <p style={{fontSize: '16px'}}>{reactionResult}</p>
        </div>
      )}

      <button 
        className="action-button secondary"
        onClick={() => {setSelectedMolecules([]); setReactionResult('');}}
        style={{marginTop: '16px'}}
      >
        <RotateCcw size={20} />
        Clear Selection
      </button>
    </div>
  );

  const renderMathGame = () => (
    <div className={`game-container ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Calculator size={28} />
        Mathematics: Quick Math Challenge
      </h2>

      <div className="score-display">
        Score: {mathScore} 🎯
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px 0', flexWrap: 'wrap', gap: '16px'}}>
        <span style={{fontSize: '48px', fontWeight: 'bold'}}>{mathProblem.a}</span>
        <span style={{fontSize: '48px', fontWeight: 'bold'}}>{mathProblem.operation}</span>
        <span style={{fontSize: '48px', fontWeight: 'bold'}}>{mathProblem.b}</span>
        <span style={{fontSize: '48px', fontWeight: 'bold'}}>=</span>
        <input
          type="number"
          value={mathProblem.answer}
          onChange={(e) => setMathProblem(prev => ({...prev, answer: e.target.value}))}
          className="equation-input"
          onKeyPress={(e) => e.key === 'Enter' && checkMathAnswer()}
          placeholder="?"
        />
      </div>

      <div className="controls">
        <button className="action-button primary" onClick={checkMathAnswer}>
          Check Answer ✓
        </button>
        <button className="action-button secondary" onClick={generateMathProblem}>
          <RotateCcw size={20} />
          New Problem
        </button>
      </div>
    </div>
  );

  const renderBiologyGame = () => (
    <div className={`game-container ${darkMode ? 'dark' : 'light'}`}>
      <h2 style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Dna size={28} />
        Biology: DNA Base Pairing Game
      </h2>

      <div className="score-display">
        DNA Score: {dnaScore} 🧬
      </div>

      <div style={{margin: '32px 0', textAlign: 'center'}}>
        <h3 style={{marginBottom: '16px', fontSize: '20px', fontWeight: '600'}}>Original DNA Strand:</h3>
        <div className="dna-sequence">
          {dnaSequence.map((base, index) => (
            <div key={index} className={`dna-base ${base}`} onClick={() => handleDnaBaseClick(base, index)}>
              {base}
            </div>
          ))}
        </div>

        <div style={{margin: '20px 0', fontSize: '24px'}}>↓</div>

        <h3 style={{margin: '24px 0 16px 0', fontSize: '20px', fontWeight: '600'}}>Complementary Strand:</h3>
        <div className="dna-sequence">
          {complementSequence.map((base, index) => (
            <div key={index} className={`dna-base ${base || 'T'}`} style={{
              background: base ? undefined : 'rgba(255, 255, 255, 0.2)',
              color: base ? 'white' : (darkMode ? '#9ca3af' : '#6b7280'),
              border: base ? '2px solid rgba(255, 255, 255, 0.3)' : '2px dashed rgba(255, 255, 255, 0.5)'
            }}>
              {base || '?'}
            </div>
          ))}
        </div>

        <p style={{margin: '20px 0', fontSize: '14px', opacity: 0.8}}>
          💡 Click on the bases in the original strand to fill in the complementary sequence<br/>
          Remember: A-T and G-C pairs!
        </p>
      </div>

      <div className="controls">
        <button className="action-button primary" onClick={checkDnaSequence}>
          Check Sequence ✓
        </button>
        <button 
          className="action-button secondary" 
          onClick={() => {
            const bases = ['A', 'T', 'G', 'C'];
            const newSequence = Array.from({ length: 4 }, () => 
              bases[Math.floor(Math.random() * bases.length)]
            );
            setDnaSequence(newSequence);
            setComplementSequence(['', '', '', '']);
          }}
        >
          <RotateCcw size={20} />
          New Sequence
        </button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'physics': return renderPhysicsGame();
      case 'chemistry': return renderChemistryGame();
      case 'math': return renderMathGame();
      case 'biology': return renderBiologyGame();
      case 'analytics': return renderAnalytics();
      default: return renderDashboard();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'physics', label: 'Physics', icon: Zap },
    { id: 'chemistry', label: 'Chemistry', icon: Atom },
    { id: 'math', label: 'Mathematics', icon: Calculator },
    { id: 'biology', label: 'Biology', icon: Dna },
    { id: 'analytics', label: 'Teacher Analytics', icon: BarChart3 },
  ];

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div ref={mouseTrailRef} className="mouse-trail"></div>
      
      <div className="dashboard-container">
        <aside className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
          <div className="logo-container">
            <div className="logo-icon">
              <BookOpen size={24} />
            </div>
            <h1 className="logo-text">EduGameHub</h1>
          </div>
          
          <nav>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-button ${darkMode ? 'dark' : 'light'} ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <div className={`nav-icon ${darkMode ? 'dark' : 'light'}`}>
                  <item.icon size={20} />
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <header className="header">
            <div>
              <h1 style={{fontSize: '32px', fontWeight: 'bold', color: darkMode ? '#f8fafc' : '#1f2937'}}>
                Welcome back, Ekarna! 👋
              </h1>
              <p style={{color: darkMode ? '#d1d5db' : '#6b7280', marginTop: '8px', fontSize: '16px'}}>
                Ready to continue your learning journey?
              </p>
            </div>
            
            <button
              className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
              onClick={() => setDarkMode(!darkMode)}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </header>

          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default EduGameHub;