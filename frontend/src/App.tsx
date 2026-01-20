// App.jsx - WORKING VERSION (No TypeScript)
import  { useState, useRef, useEffect } from 'react';
import './App.css';

const WS_URL = 'ws://localhost:3000';

function App() {
  const [ws, setWs] = useState<WebSocket>();
  const [fileId, setFileId] = useState('');
  const [userId, setUserId] = useState('');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [connected, setConnected] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const contentRef = useRef('');

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);
    
    websocket.onopen = () => {
      setStatus('✅ Connected');
      setConnected(true);
      console.log('✅ WebSocket Connected');
    };

    websocket.onmessage = (event) => {
      try {
        JSON.parse(event.data); // Try JSON first
      } catch {
        const text = event.data;
        console.log('📨 Text:', text);
        
        if (text === "boss cretaed the hood" || text === "thug added to the hood") {
          setStatus(text.includes('boss') ? '✅ File Created!' : '✅ Joined File!');
          setShowEditor(true);
        }
      }
    };

    websocket.onclose = () => {
      setStatus('❌ Disconnected');
      setConnected(false);
      setShowEditor(false);
    };

    websocket.onerror = () => {
      setStatus('❌ Error');
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const createFile = () => {
    if (!filename || !userId || !ws) return alert('Fill User ID & File Name');
    
    ws.send(JSON.stringify({
      type: 'create',
      fileName: filename,
      userId: userId
    }));
  };

  const joinFile = () => {
    if (!fileId || !userId || !filename || !ws) return alert('Fill ALL fields');
    
    ws.send(JSON.stringify({
      type: 'interact',
      filename: filename,
      userId: userId,
      fileId: fileId
    }));
  };
  //@ts-ignore
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    contentRef.current = newContent;
    setContent(newContent);
    
    if (ws && fileId) {
      ws.send(JSON.stringify({
        type: 'contribute',
        content: newContent,
        fileId: fileId
      }));
    }
  };

  const goBack = () => {
    setShowEditor(false);
    setFileId('');
    setFilename('');
    setContent('');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📁 File Collaborator</h1>
        <div className={`status ${connected ? 'connected' : ''}`}>
          {status}
        </div>
      </header>

      {!showEditor ? (
        <div className="login-form">
          <h2>{connected ? 'Create or Join File' : 'Connecting...'}</h2>
          
          <input
            placeholder="Your User ID *"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input"
            disabled={!connected}
          />
          
          <input
            placeholder="File Name *"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="input"
            disabled={!connected}
          />
          
          <input
            placeholder="File ID (for joining)"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            className="input"
            disabled={!connected}
          />
          
          <div className="buttons">
            <button 
              onClick={createFile} 
              className="btn-primary"
              disabled={!connected || !userId || !filename}
            >
              🚀 Create File
            </button>
            <button 
              onClick={joinFile}
              className="btn-secondary"
              disabled={!connected || !userId || !filename || !fileId}
            >
              👥 Join File
            </button>
          </div>
        </div>
      ) : (
        <div className="editor">
          <div className="editor-header">
            <div>
              <h3>{filename} <small>[{fileId}]</small></h3>
              <div>User: {userId}</div>
            </div>
            <button onClick={goBack} className="btn-back">
              ← Back
            </button>
          </div>
          
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Collaborate live... Type to sync!"
            className="editor-textarea"
            rows={30}
          />
          
          <div className="editor-footer">
            <button onClick={() => {
              setContent('');
              if (ws && fileId) {
                ws.send(JSON.stringify({ type: 'contribute', content: '', fileId }));
              }
            }} className="btn-clear">
              🗑️ Clear
            </button>
            <small>{content.length} chars</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
