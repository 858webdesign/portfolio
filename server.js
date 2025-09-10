// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

// Allow cross-origin requests from your Next.js app
app.use(cors());

// Serve static files from the 'audio' directory
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// API endpoint to list audio files
app.get('/api/audio-files', (req, res) => {
  const audioDir = path.join(__dirname, 'audio');

  fs.readdir(audioDir, (err, files) => {
    if (err) {
      console.error('Error reading audio directory:', err);
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    
    // Filter for common audio file types
    const audioFiles = files.filter(file => 
      file.endsWith('.mp3') || 
      file.endsWith('.wav') || 
      file.endsWith('.ogg')
    );
    
    res.json({ files: audioFiles });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});