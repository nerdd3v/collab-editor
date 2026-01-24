import { useState, useRef, useEffect, useCallback } from "react";

const WS_URL = 'ws://localhost:3000';

function App() {
  const [uid, setUid] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileId, setFileId] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [status, setStatus] = useState<string>('Connecting...');
  const [connected, setConnected] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);  
  const [posX, setPosX] = useState(0);
const [posY, setPosY] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const ballRef = useRef<HTMLDivElement>(null);



  // Fixed uidHandler - use onChange properly
  const uidHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUid(e.target.value);
  }, []);

  const fileNameHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  }, []);

  const fileIdHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFileId(e.target.value);
  }, []);

  // WebSocket connection with retry logic
  useEffect(() => {
    let retries = 0;
    const maxRetries = 10;

    const connect = () => {
      if (retries >= maxRetries) {
        setStatus('❌ Max retries reached. Refresh page.');
        return;
      }

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('✅ Connected');
        setConnected(true);
        retries = 0; // Reset retries
        retryCountRef.current = 0;
        console.log('✅ WebSocket Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 JSON:', data);
        } catch {
          const text = event.data;
          console.log('📨 Text:', text);
          
          if (text === "boss created the hood" || text === "thug added to the hood") {
            setStatus(text.includes('boss') ? '✅ File Created!' : '✅ Joined File!');
            setShowEditor(true);
          }
        }
      };

      ws.onclose = () => {
        console.log('🔌 Disconnected');
        setStatus(`❌ Reconnecting... (${retries + 1}/${maxRetries})`);
        setConnected(false);
        setShowEditor(false);

        const delay = Math.min(1000 * Math.pow(2, retries), 30000);
        retries++;
        retryCountRef.current = retries;

        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setStatus('❌ Connection Error');
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const createFile = () => {
    if (!uid || !fileName || !wsRef.current || !connected) {
      alert('Fill User ID & File Name and wait for connection');
      return;
    }
    
    wsRef.current.send(JSON.stringify({
      type: 'create',
      fileName,
      userId: uid
    }));
  };

  const joinFile = () => {
    if (!uid || !fileName || !fileId || !wsRef.current || !connected) {
      alert('Fill ALL fields and wait for connection');
      return;
    }
    
    wsRef.current.send(JSON.stringify({
      type: 'interact',
      filename: fileName,
      userId: uid,
      fileId
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (wsRef.current && connected && fileId) {
      wsRef.current.send(JSON.stringify({
        type: 'contribute',
        content: newContent,
        fileId
      }));
    }
  };

  const clearContent = () => {
    setContent('');
    if (wsRef.current && connected && fileId) {
      wsRef.current.send(JSON.stringify({
        type: 'contribute',
        content: '',
        fileId
      }));
    }
  };

  const goBack = () => {
    setShowEditor(false);
    setFileId('');
    setFileName('');
    setContent('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📁 File Collaborator</h1>
      <div style={{ 
        padding: '10px', 
        background: connected ? '#d4edda' : '#f8d7da', 
        borderRadius: '5px', 
        marginBottom: '20px' 
      }}>
        <strong>Status:</strong> {status}
      </div>

      {!showEditor ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="User ID *"
            value={uid}
            onChange={uidHandler}
            disabled={!connected}
            style={{ padding: '10px', fontSize: '16px' }}
          />
          
          <input
            type="text"
            placeholder="File Name *"
            value={fileName}
            onChange={fileNameHandler}
            disabled={!connected}
            style={{ padding: '10px', fontSize: '16px' }}
          />
          
          <input
            type="text"
            placeholder="File ID (for joining)"
            value={fileId}
            onChange={fileIdHandler}
            disabled={!connected}
            style={{ padding: '10px', fontSize: '16px' }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={createFile}
              disabled={!connected || !uid || !fileName}
              style={{
                padding: '12px 24px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: connected && uid && fileName ? 'pointer' : 'not-allowed'
              }}
            >
              🚀 Create File
            </button>
            <button 
              onClick={joinFile}
              disabled={!connected || !uid || !fileName || !fileId}
              style={{
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: connected && uid && fileName && fileId ? 'pointer' : 'not-allowed'
              }}
            >
              👥 Join File
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            padding: '15px',
            background: '#e9ecef',
            borderRadius: '5px'
          }}>
            <div>
              <h3>{fileName} <small style={{ color: '#6c757d' }}>[{fileId}]</small></h3>
              <div>User: {uid}</div>
            </div>
            <button 
              onClick={goBack}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <div
    ref={ballRef}
    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      e.preventDefault(); // Prevent text selection
    }}
    onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        setPosX(e.clientX - 5); // -5 to center the 10x10 ball
        setPosY(e.clientY - 5);
      }
    }}
    onMouseUp={() => setIsDragging(false)}
    onMouseLeave={() => setIsDragging(false)}
    style={{
      height: "10px",
      width: "10px",
      backgroundColor: "green",
      borderRadius: "50%",
      zIndex: 12,
      position: "absolute",
      left: `${posX}px`,
      top: `${posY}px`,
      cursor: 'grab',
      transform: 'translate(-50%, -50%)', // Perfect centering
      transition: isDragging ? 'none' : 'all 0.1s ease', // Smooth when not dragging
      boxShadow: isDragging ? '0 0 10px rgba(0,255,0,0.5)' : 'none'
    }}
  />
  
  <textarea
    value={content}
    onChange={handleContentChange}
    placeholder="Collaborate live... Type to sync! (Drag green ball around)"
    style={{
      width: '100%',
      height: '400px',
      padding: '15px',
      fontSize: '16px',
      border: '2px solid #3b83ca',
      borderRadius: '5px',
      resize: 'vertical',
      fontFamily: 'monospace',
      position: 'relative',
      zIndex: 1 // Behind the ball
    }}
  />
</div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '15px' 
          }}>
            <button 
              onClick={clearContent}
              style={{
                padding: '10px 20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear
            </button>
            <small>{content.length} characters</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
