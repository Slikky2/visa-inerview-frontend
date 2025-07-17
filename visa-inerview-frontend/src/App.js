import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; // NEW: Import the CSS file
import { speak, startListening, stopListening, sendMessage } from './voiceUtils';


const socket = io('http://localhost:3001'); // Change to your deployed backend URL

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [finalDecision, setFinalDecision] = useState('');
  const [hasStarted, setHasStarted] = useState(false); // NEW: State for starting the interview
  const recognitionRef = useRef(null);

  // ... (The rest of the useEffect for SpeechRecognition remains unchanged)

  useEffect(() => {
  if (recognitionRef.current) {
    // recognitionRef will be used here in the future
  }
}, []);


  // Handle incoming messages and interview end
  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (voiceEnabled) {
        speak(msg.text);
        if (!interviewEnded) startListening();
      }
    });

    socket.on('interviewEnd', ({ decision }) => {
      setInterviewEnded(true);
      setFinalDecision(decision);
      if (voiceEnabled) {
        speak(`Simulation complete. ${decision.replace('DECISION: ', '')}`);
      }
    });
  }, [voiceEnabled, interviewEnded]);

  // ... (speak, startListening, stopListening, sendMessage functions remain unchanged)

  // NEW: Function to start the interview
  const startInterview = () => {
    setHasStarted(true);
    // Socket is already connected; initial message is emitted on connection
  };

  return (
    <div>
      <h1>Visa Interview Simulator - U.S. Embassy, Accra, Ghana</h1>
      <p><strong>Disclaimer:</strong> This is a fictional simulation for educational purposes only. It does not represent official U.S. government decisions. Always consult official sources like travel.state.gov.</p>
      
      {!hasStarted ? (
        // NEW: Start screen
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Click below to begin your simulated visa interview.</p>
          <button className="start-button" onClick={startInterview}>
            Start Interview
          </button>
        </div>
      ) : (
        // Main UI (only shown after starting)
        <>
          <p>Use voice for a realistic experience (Chrome recommended). Speak clearly after the agent finishes.</p>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
            {voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
          </button>
          <button onClick={startListening} disabled={isListening || !voiceEnabled || interviewEnded}>
            Start Listening
          </button>
          <button onClick={stopListening} disabled={!isListening}>
            Stop Listening
          </button>
          <div className="chat-window">
            {messages.map((msg, idx) => (
              <p key={idx} className={msg.sender}><strong>{msg.sender}:</strong> {msg.text}</p>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here if voice isn't working"
            disabled={interviewEnded}
          />
          <button onClick={sendMessage} disabled={interviewEnded}>Send Text</button>
          {interviewEnded && (
            <div className="decision-box">
              <h2>Interview Complete</h2>
              <p><strong>Simulated Decision:</strong> {finalDecision}</p>
              <button className="restart-button" onClick={() => window.location.reload()}>Restart Interview</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
