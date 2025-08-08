# Watermark Tool - Cloudflare worker
## Vibe coded with ❤ and https://justlab.ai APIs

A completely static, client-side watermark tool served via Cloudflare Workers. All image processing happens in the browser using Canvas API.

try it out here https://caption.justlab.ai/

## Features

- 🎨 **Custom Text Watermarks**: Add artistic signatures to your images
- 🔤 **Multiple Fonts**: Choose from various fonts including signature styles
- 🎯 **Position Control**: 9 preset positions for watermark placement
- 🎨 **Color & Opacity**: Full color picker with opacity control
- 💾 **Settings Persistence**: Save and load your preferred settings
- 📥 **JSON Export**: Export settings as JSON for backup
- 🚀 **100% Client-Side**: No server processing, completely private
- 📱 **Responsive Design**: Works on desktop and mobile

## Installation

1. Install dependencies:
```bash
npm install
```

2. Login to Cloudflare (if not already):
```bash
npx wrangler login
```

3. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Development

Run locally with hot reload:
```bash
npm run dev
```

This will start a local development server (usually at http://localhost:8787)

## How It Works

The Cloudflare Worker simply serves a single HTML file with embedded CSS and JavaScript. All functionality runs in the browser:

- **Image Upload**: Uses FileReader API
- **Watermark Rendering**: Canvas API for text overlay
- **Settings Storage**: localStorage for persistence
- **Export**: Blob API for JSON download
- **Image Download**: Canvas.toDataURL() for final image

## Available Fonts

All fonts are loaded from Google Fonts (CC/Open licenses):
- Roboto (Default)
- Dancing Script (Signature style)
- Bebas Neue
- Pacifico
- Permanent Marker
- Courier Prime

## Settings Structure

Settings are saved/exported in this JSON format:
```json
{
  "text": "© Your Name",
  "font": "Dancing Script",
  "fontSize": "30",
  "color": "#ffffff",
  "opacity": "80",
  "position": "bottom-right"
}
```

## Browser Compatibility

Works in all modern browsers that support:
- Canvas API
- FileReader API
- localStorage
- ES6 JavaScript

## Privacy

- No images are uploaded to any server
- All processing happens locally in your browser
- Settings are stored only in your browser's localStorage
- Completely private and secure

## License

MIT
