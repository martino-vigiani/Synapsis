const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Restore the original generic action handler since video generation is not fully implemented.
router.get('/:action', (req, res) => {
  const { action } = req.params;
  res.send(`AI action: ${action}`);
});

router.post('/generate-video', (req, res) => {
  const { prompt, length } = req.body;

  if (!prompt || !length) {
    return res.status(400).send('Prompt and length are required');
  }

  // NOTE TO USER: The following script execution is a placeholder.
  // The actual video generation from the GGUF model is not implemented
  // due to the lack of a suitable Python library for this specific task.
  const scriptPath = path.join(__dirname, '..', 'GenVideo.py');
  const command = `python3 ${scriptPath} "${prompt}" "${length}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing GenVideo.py: ${error.message}`);
      return res.status(500).send('Failed to generate video placeholder');
    }
    if (stderr) {
      // Log stderr but don't fail, as some libraries write warnings here.
      console.error(`GenVideo.py stderr: ${stderr}`);
    }

    const videoPath = stdout.trim();
    // The script returns a path relative to the 'public' directory.
    res.json({ videoUrl: `/${videoPath}` });
  });
});

module.exports = router;