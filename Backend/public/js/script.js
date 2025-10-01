document.addEventListener('DOMContentLoaded', () => {
    const codeBackground = document.getElementById('code-background');

    const codeLines = [
        `<span class="token-comment">// server.js - Synapsis Core</span>`,
        `<span class="token-keyword">const</span> http <span class="token-operator">=</span> require(<span class="token-string">'http'</span>);`,
        `<span class="token-keyword">const</span> express <span class="token-operator">=</span> require(<span class="token-string">'express'</span>);`,
        `<span class="token-keyword">const</span> { WebSocketServer } <span class="token-operator">=</span> require(<span class="token-string">'ws'</span>);`,
        `<span class="token-keyword">const</span> path <span class="token-operator">=</span> require(<span class="token-string">'path'</span>);`,
        ``,
        `<span class="token-comment">/**</span>`,
        `<span class="token-comment"> * Represents the main application server.</span>`,
        `<span class="token-comment"> * @extends http.Server</span>`,
        `<span class="token-comment"> */</span>`,
        `<span class="token-keyword">class</span> <span class="token-class-name">SynapsisApp</span> {`,
        `  <span class="token-function">constructor</span>() {`,
        `    <span class="token-keyword">this</span>.app <span class="token-operator">=</span> <span class="token-function">express</span>();`,
        `    <span class="token-keyword">this</span>.server <span class="token-operator">=</span> http.<span class="token-function">createServer</span>(<span class="token-keyword">this</span>.app);`,
        `    <span class="token-keyword">this</span>.wss <span class="token-operator">=</span> <span class="token-keyword">new</span> <span class="token-class-name">WebSocketServer</span>({ server: <span class="token-keyword">this</span>.server });`,
        `    <span class="token-keyword">this</span>.<span class="token-function">_setupMiddleware</span>();`,
        `    <span class="token-keyword">this</span>.<span class="token-function">_setupRoutes</span>();`,
        `    <span class="token-keyword">this</span>.<span class="token-function">_handleSockets</span>();`,
        `  }`,
        ``,
        `  <span class="token-comment">// Private method for middleware configuration</span>`,
        `  <span class="token-function">_setupMiddleware</span>() {`,
        `    <span class="token-keyword">this</span>.app.<span class="token-function">use</span>(express.<span class="token-function">json</span>());`,
        `    <span class="token-keyword">this</span>.app.<span class="token-function">use</span>(express.<span class="token-function">static</span>(path.<span class="token-function">join</span>(__dirname, <span class="token-string">'public'</span>)));`,
        `  }`,
        ``,
        `  <span class="token-comment">// Setup application routing</span>`,
        `  <span class="token-function">_setupRoutes</span>() {`,
        `    <span class="token-keyword">this</span>.app.<span class="token-function">get</span>(<span class="token-string">'/status'</span>, (req, res) <span class="token-operator">=></span> {`,
        `      res.<span class="token-function">status</span>(<span class="token-number">200</span>).<span class="token-function">json</span>({ status: <span class="token-string">'OK'</span>, timestamp: <span class="token-keyword">new</span> <span class="token-class-name">Date</span>() });`,
        `    });`,
        `  }`,
        ``,
        `  <span class="token-comment">// Handle WebSocket connections</span>`,
        `  <span class="token-function">_handleSockets</span>() {`,
        `    <span class="token-keyword">this</span>.wss.<span class="token-function">on</span>(<span class="token-string">'connection'</span>, (ws) <span class="token-operator">=></span> {`,
        `      console.<span class="token-function">log</span>(<span class="token-string">'Client connected'</span>);`,
        `      ws.<span class="token-function">on</span>(<span class="token-string">'message'</span>, (message) <span class="token-operator">=></span> {`,
        `        console.<span class="token-function">log</span>(<span class="token-string">'received: %s'</span>, message);`,
        `        ws.<span class="token-function">send</span>(<span class="token-string">\`Echo: <span class="token-variable">${message}</span>\`</span>);`,
        `      });`,
        `      ws.<span class="token-function">send</span>(<span class="token-string">'Welcome to Synapsis Real-time Interface!'</span>);`,
        `    });`,
        `  }`,
        ``,
        `  <span class="token-comment">/**</span>`,
        `   <span class="token-comment">* Starts the server on a given port.</span>`,
        `   <span class="token-comment">* @param {number} port The port to listen on.</span>`,
        `   <span class="token-comment">*/</span>`,
        `  <span class="token-function">listen</span>(port) {`,
        `    <span class="token-keyword">this</span>.server.<span class="token-function">listen</span>(port, () <span class="token-operator">=></span> {`,
        `      console.<span class="token-function">log</span>(<span class="token-string">\`Synapsis server running on port <span class="token-variable">${port}</span>\`</span>);`,
        `    });`,
        `  }`,
        `}`,
        ``,
        `<span class="token-keyword">const</span> PORT <span class="token-operator">=</span> process.env.PORT <span class="token-operator">||</span> <span class="token-number">3000</span>;`,
        `<span class="token-keyword">const</span> synapsis <span class="token-operator">=</span> <span class="token-keyword">new</span> <span class="token-class-name">SynapsisApp</span>();`,
        `<span class="token-variable">synapsis</span>.<span class="token-function">listen</span>(PORT);`,
    ];

    let currentLines = [];
    let lineIndex = 0;
    let charIndex = 0;

    function type() {
        if (lineIndex < codeLines.length) {
            const line = codeLines[lineIndex];
            if (charIndex < line.length) {
                // Add character by character
                codeBackground.innerHTML = currentLines.join('\\n') + '\\n' + line.substring(0, charIndex + 1) + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(type, 10); // Typing speed
            } else {
                // Line finished
                currentLines.push(line);
                lineIndex++;
                charIndex = 0;
                setTimeout(type, 50); // Pause between lines
            }
        } else {
            // Finished typing, restart
            setTimeout(() => {
                currentLines = [];
                lineIndex = 0;
                charIndex = 0;
                codeBackground.innerHTML = '';
                type();
            }, 3000); // Pause before restarting
        }
    }

    type();
});
