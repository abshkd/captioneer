// Cloudflare Worker - Serves the static watermark tool
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watermark Tool</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Dancing+Script:wght@700&family=Bebas+Neue&family=Pacifico&family=Permanent+Marker&family=Courier+Prime:wght@700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header h1 {
            font-size: 1.5em;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header p {
            opacity: 0.9;
            margin: 0;
            font-size: 0.9em;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9em;
        }

        .header-right a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-bottom 0.3s;
        }

        .header-right a:hover {
            border-bottom: 1px solid white;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 30px;
            padding: 30px;
        }

        .canvas-section {
            position: relative;
        }

        .canvas-container {
            position: relative;
            background: #f5f5f5;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 500px;
        }

        #canvas {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            cursor: crosshair;
        }

        .upload-area {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 10px;
            border: 3px dashed #667eea;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-area:hover {
            border-color: #764ba2;
            transform: translate(-50%, -50%) scale(1.05);
        }

        .upload-area.hidden {
            display: none;
        }

        .upload-icon {
            font-size: 48px;
            color: #667eea;
            margin-bottom: 20px;
        }

        #fileInput {
            display: none;
        }

        .controls {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }

        .control-group {
            margin-bottom: 25px;
        }

        .control-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }

        .control-group input,
        .control-group select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        .control-group input:focus,
        .control-group select:focus {
            outline: none;
            border-color: #667eea;
        }

        .color-input-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .color-input-wrapper input[type="color"] {
            width: 60px;
            height: 40px;
            border-radius: 5px;
            cursor: pointer;
        }

        .color-input-wrapper input[type="text"] {
            flex: 1;
        }

        .position-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-top: 10px;
        }

        .position-btn {
            padding: 15px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .position-btn:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .position-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .slider-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .slider-container input[type="range"] {
            flex: 1;
        }

        .slider-value {
            min-width: 50px;
            text-align: center;
            font-weight: bold;
            color: #667eea;
        }

        .button-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 30px;
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }

        .btn-secondary:hover {
            background: #667eea;
            color: white;
        }

        .btn-full {
            grid-column: span 2;
        }

        .settings-actions {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
        }

        .opacity-container {
            margin-top: 15px;
        }

        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }

            .header {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }

            .header h1 {
                font-size: 1.2em;
            }

            .header-right {
                font-size: 0.8em;
            }
        }

        /* Toast Notifications */
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        .toast {
            background: white;
            color: #333;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            min-width: 250px;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
            transition: all 0.3s ease;
        }

        .toast.success {
            border-left: 4px solid #10b981;
        }

        .toast.error {
            border-left: 4px solid #ef4444;
        }

        .toast.info {
            border-left: 4px solid #3b82f6;
        }

        .toast.warning {
            border-left: 4px solid #f59e0b;
        }

        .toast-icon {
            font-size: 20px;
        }

        .toast.success .toast-icon { color: #10b981; }
        .toast.error .toast-icon { color: #ef4444; }
        .toast.info .toast-icon { color: #3b82f6; }
        .toast.warning .toast-icon { color: #f59e0b; }

        .toast-message {
            flex: 1;
        }

        .toast-close {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            font-size: 18px;
        }

        .toast-close:hover {
            opacity: 1;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h1>🎨 Watermark Tool</h1>
                <p>Add beautiful watermarks to your images</p>
            </div>
            <div class="header-right">
                <span>A community project by</span>
                <a href="https://justlab.ai" target="_blank" rel="noopener">justlab.ai</a>
            </div>
        </div>

        <div class="main-content">
            <div class="canvas-section">
                <div class="canvas-container">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon">📸</div>
                        <h3>Upload Your Image</h3>
                        <p>Click or drag & drop</p>
                    </div>
                    <canvas id="canvas" style="display: none;"></canvas>
                    <input type="file" id="fileInput" accept="image/*">
                </div>
            </div>

            <div class="controls">
                <h3 style="margin-bottom: 20px; color: #333;">Watermark Settings</h3>

                <div class="control-group">
                    <label for="watermarkText">Text</label>
                    <input type="text" id="watermarkText" placeholder="Enter your watermark text" value="© Your Name">
                </div>

                <div class="control-group">
                    <label for="fontSelect">Font</label>
                    <select id="fontSelect">
                        <option value="Roboto">Roboto</option>
                        <option value="Dancing Script">Dancing Script (Signature)</option>
                        <option value="Bebas Neue">Bebas Neue</option>
                        <option value="Pacifico">Pacifico</option>
                        <option value="Permanent Marker">Permanent Marker</option>
                        <option value="Courier Prime">Courier Prime</option>
                    </select>
                </div>

                <div class="control-group">
                    <label for="fontSize">Size</label>
                    <div class="slider-container">
                        <input type="range" id="fontSize" min="12" max="120" value="30">
                        <span class="slider-value" id="fontSizeValue">30px</span>
                    </div>
                </div>

                <div class="control-group">
                    <label for="colorPicker">Color</label>
                    <div class="color-input-wrapper">
                        <input type="color" id="colorPicker" value="#ffffff">
                        <input type="text" id="colorHex" value="#ffffff" placeholder="#ffffff">
                    </div>
                </div>

                <div class="control-group opacity-container">
                    <label for="opacity">Opacity</label>
                    <div class="slider-container">
                        <input type="range" id="opacity" min="0" max="100" value="80">
                        <span class="slider-value" id="opacityValue">80%</span>
                    </div>
                </div>

                <div class="control-group">
                    <label>Position</label>
                    <div class="position-grid">
                        <button class="position-btn" data-position="top-left">↖</button>
                        <button class="position-btn" data-position="top-center">↑</button>
                        <button class="position-btn" data-position="top-right">↗</button>
                        <button class="position-btn" data-position="middle-left">←</button>
                        <button class="position-btn" data-position="middle-center">●</button>
                        <button class="position-btn" data-position="middle-right">→</button>
                        <button class="position-btn" data-position="bottom-left">↙</button>
                        <button class="position-btn" data-position="bottom-center">↓</button>
                        <button class="position-btn active" data-position="bottom-right">↘</button>
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn btn-secondary" id="resetWatermark">Reset</button>
                    <button class="btn btn-secondary" id="newImage">📸 New Image</button>
                    <button class="btn btn-primary btn-full" id="downloadImage">Download Image</button>
                </div>

                <div class="settings-actions">
                    <h4 style="margin-bottom: 15px; color: #333;">Settings</h4>
                    <div class="button-group">
                        <button class="btn btn-secondary" id="saveSettings">Save Settings</button>
                        <button class="btn btn-secondary" id="loadSettings">Load Settings</button>
                        <button class="btn btn-secondary btn-full" id="uploadSettings">📤 Upload Settings JSON</button>
                        <input type="file" id="settingsFileInput" accept=".json" style="display: none;">
                        <button class="btn btn-primary btn-full" id="exportSettings">📥 Export Settings as JSON</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer"></div>

    <script>
        // Toast notification system
        function showToast(message, type = 'info') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = \`toast \${type}\`;
            
            const icons = {
                success: '✓',
                error: '✕',
                info: 'ℹ',
                warning: '⚠'
            };
            
            toast.innerHTML = \`
                <span class="toast-icon">\${icons[type]}</span>
                <span class="toast-message">\${message}</span>
                <span class="toast-close">×</span>
            \`;
            
            toastContainer.appendChild(toast);
            
            // Auto remove after 3 seconds
            const timeout = setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
            
            // Manual close
            toast.querySelector('.toast-close').addEventListener('click', () => {
                clearTimeout(timeout);
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            });
        }

        // Application state
        let originalImage = null;
        let currentPosition = 'bottom-right';
        let imageLoaded = false;

        // DOM elements
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const watermarkText = document.getElementById('watermarkText');
        const fontSelect = document.getElementById('fontSelect');
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const colorPicker = document.getElementById('colorPicker');
        const colorHex = document.getElementById('colorHex');
        const opacity = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacityValue');

        // Auto-apply watermark on any change
        const autoApplyWatermark = () => {
            if (imageLoaded) {
                applyWatermark(false); // false = no toast notification
            }
        };

        // Event Listeners
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Add auto-apply listeners to all controls
        watermarkText.addEventListener('input', autoApplyWatermark);
        fontSelect.addEventListener('change', autoApplyWatermark);
        fontSize.addEventListener('input', (e) => {
            fontSizeValue.textContent = e.target.value + 'px';
            autoApplyWatermark();
        });
        opacity.addEventListener('input', (e) => {
            opacityValue.textContent = e.target.value + '%';
            autoApplyWatermark();
        });
        colorPicker.addEventListener('input', (e) => {
            colorHex.value = e.target.value;
            autoApplyWatermark();
        });
        colorHex.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                colorPicker.value = e.target.value;
                autoApplyWatermark();
            }
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#764ba2';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });

        // Position buttons with auto-apply
        document.querySelectorAll('.position-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPosition = btn.dataset.position;
                autoApplyWatermark();
            });
        });

        // Reset button
        document.getElementById('resetWatermark').addEventListener('click', () => {
            if (!imageLoaded) {
                showToast('No image to reset', 'info');
                return;
            }
            if (originalImage) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
                showToast('Image reset to original', 'info');
            }
        });

        // New Image button
        document.getElementById('newImage').addEventListener('click', () => {
            fileInput.click();
        });

        // Canvas click to upload new image (with modifier key)
        canvas.addEventListener('click', (e) => {
            if (e.shiftKey || e.ctrlKey || e.metaKey) {
                fileInput.click();
            }
        });
        
        // Add tooltip on canvas
        canvas.title = 'Shift+Click or Ctrl+Click to upload new image';

        // Download button
        document.getElementById('downloadImage').addEventListener('click', () => {
            if (!imageLoaded) {
                showToast('Please upload an image first', 'warning');
                return;
            }
            const link = document.createElement('a');
            link.download = 'watermarked-image.png';
            link.href = canvas.toDataURL();
            link.click();
            showToast('Image downloaded successfully!', 'success');
        });

        // Settings buttons
        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('loadSettings').addEventListener('click', loadSettings);
        document.getElementById('exportSettings').addEventListener('click', exportSettings);
        
        // Upload settings JSON
        const settingsFileInput = document.getElementById('settingsFileInput');
        document.getElementById('uploadSettings').addEventListener('click', () => {
            settingsFileInput.click();
        });
        
        settingsFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const settings = JSON.parse(event.target.result);
                        applySettings(settings);
                        showToast('Settings uploaded successfully!', 'success');
                        if (imageLoaded) {
                            applyWatermark(false);
                        }
                    } catch (err) {
                        showToast('Invalid settings file', 'error');
                    }
                };
                reader.readAsText(file);
            } else {
                showToast('Please upload a valid JSON file', 'error');
            }
            e.target.value = ''; // Reset file input
        });

        // Functions
        function handleImageUpload(file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please upload an image file', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    imageLoaded = true;
                    
                    // Set canvas dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw image
                    ctx.drawImage(img, 0, 0);
                    
                    // Show canvas, hide upload area
                    canvas.style.display = 'block';
                    uploadArea.classList.add('hidden');
                    
                    showToast('Image uploaded successfully!', 'success');
                    
                    // Auto-apply watermark with current settings
                    if (watermarkText.value.trim()) {
                        setTimeout(() => applyWatermark(false), 100);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function applyWatermark(showNotification = true) {
            if (!imageLoaded) {
                if (showNotification) {
                    showToast('Please upload an image first', 'warning');
                }
                return;
            }

            if (!watermarkText.value.trim()) {
                if (showNotification) {
                    showToast('Please enter watermark text', 'warning');
                }
                return;
            }

            // Redraw original image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImage, 0, 0);

            // Get watermark settings
            const text = watermarkText.value;
            const font = fontSelect.value;
            const size = fontSize.value;
            const color = colorPicker.value;
            const opacityValue = opacity.value / 100;

            // Set font properties - proper font family syntax
            const fontFamily = font === 'Dancing Script' || font === 'Bebas Neue' || font === 'Courier Prime' 
                ? \`"\${font}"\` 
                : font;
            ctx.font = \`700 \${size}px \${fontFamily}, sans-serif\`;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacityValue;

            // Calculate text dimensions
            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = parseInt(size);
            const padding = 20;

            // Calculate position
            let x, y;
            const positions = {
                'top-left': { x: padding, y: padding + textHeight },
                'top-center': { x: (canvas.width - textWidth) / 2, y: padding + textHeight },
                'top-right': { x: canvas.width - textWidth - padding, y: padding + textHeight },
                'middle-left': { x: padding, y: canvas.height / 2 },
                'middle-center': { x: (canvas.width - textWidth) / 2, y: canvas.height / 2 },
                'middle-right': { x: canvas.width - textWidth - padding, y: canvas.height / 2 },
                'bottom-left': { x: padding, y: canvas.height - padding },
                'bottom-center': { x: (canvas.width - textWidth) / 2, y: canvas.height - padding },
                'bottom-right': { x: canvas.width - textWidth - padding, y: canvas.height - padding }
            };

            const pos = positions[currentPosition];
            
            // Apply shadow for better visibility
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Draw text
            ctx.fillText(text, pos.x, pos.y);

            // Reset global alpha and shadow
            ctx.globalAlpha = 1;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            if (showNotification) {
                showToast('Watermark applied!', 'success');
            }
        }

        function getSettings() {
            return {
                text: watermarkText.value,
                font: fontSelect.value,
                fontSize: fontSize.value,
                color: colorPicker.value,
                opacity: opacity.value,
                position: currentPosition
            };
        }

        function applySettings(settings) {
            watermarkText.value = settings.text || '© Your Name';
            fontSelect.value = settings.font || 'Roboto';
            fontSize.value = settings.fontSize || 30;
            fontSizeValue.textContent = fontSize.value + 'px';
            colorPicker.value = settings.color || '#ffffff';
            colorHex.value = settings.color || '#ffffff';
            opacity.value = settings.opacity || 80;
            opacityValue.textContent = opacity.value + '%';
            
            // Update position
            currentPosition = settings.position || 'bottom-right';
            document.querySelectorAll('.position-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.position === currentPosition) {
                    btn.classList.add('active');
                }
            });
        }

        function saveSettings() {
            const settings = getSettings();
            localStorage.setItem('watermarkSettings', JSON.stringify(settings));
            showToast('Settings saved successfully!', 'success');
        }

        function loadSettings() {
            const saved = localStorage.getItem('watermarkSettings');
            if (saved) {
                try {
                    const settings = JSON.parse(saved);
                    applySettings(settings);
                    showToast('Settings loaded successfully!', 'success');
                    if (imageLoaded) {
                        applyWatermark(false);
                    }
                } catch (e) {
                    showToast('Error loading settings', 'error');
                }
            } else {
                showToast('No saved settings found', 'info');
            }
        }

        function exportSettings() {
            const settings = getSettings();
            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'watermark-settings.json';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            showToast('Settings exported as JSON!', 'success');
        }

        // Load saved settings on page load
        window.addEventListener('load', () => {
            const saved = localStorage.getItem('watermarkSettings');
            if (saved) {
                try {
                    const settings = JSON.parse(saved);
                    applySettings(settings);
                } catch (e) {
                    console.error('Error loading saved settings:', e);
                }
            }
        });
    </script>
</body>
</html>`;

export default {
    async fetch(request, env, ctx) {
        return new Response(HTML_CONTENT, {
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
            },
        });
    },
};
