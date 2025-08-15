# Proxy Manager Chrome Extension

A fully functional Chrome browser extension (Manifest V3) built with React, TypeScript, and TailwindCSS that allows users to easily manage HTTP/HTTPS proxies.

## 🚀 Features

- **Easy Proxy Configuration**: Enter proxy host, port, username, and password
- **One-Click Toggle**: Enable/disable proxy with a single click
- **Persistent Settings**: Automatically saves and restores proxy settings
- **Authentication Support**: Handles proxy authentication automatically
- **Real-time Status**: Shows current proxy status with visual indicators
- **Modern UI**: Dark theme with glassmorphism effects using TailwindCSS
- **Cross-Session Persistence**: Settings persist across browser restarts

## 🛠️ Tech Stack

- **UI Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Build Tool**: Vite with multiple entry points
- **Extension API**: Chrome Manifest V3
- **Storage**: chrome.storage (sync with local fallback)
- **Communication**: chrome.runtime messaging
- **Proxy Management**: chrome.proxy API
- **Authentication**: chrome.webRequest.onAuthRequired

## 📋 Prerequisites

- Node.js 18+ and npm
- Chrome browser
- Developer mode enabled in Chrome Extensions

## 🔧 Installation & Development

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ProPlayground
npm install
```

### 2. Development Build

```bash
# Build for development with watch mode
npm run dev

# Or build for production
npm run build
```

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked" button
4. Select the `dist` folder from this project
5. The extension should now appear in your extensions list

### 4. Using the Extension

1. Click the Proxy Manager icon in the Chrome toolbar
2. Enter your proxy details:
   - **Host**: IP address or domain name (e.g., `proxy.example.com` or `192.168.1.1`)
   - **Port**: Port number (1-65535)
   - **Username**: Optional authentication username
   - **Password**: Optional authentication password
3. Click "Save" to store the settings
4. Click "Enable" to activate the proxy
5. The status indicator will show "🟢 Proxy Enabled"

## 🎯 Scripts

- `npm run dev` - Development build with watch mode
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## 🔐 Permissions Explained

The extension requires the following permissions:

- **proxy**: To configure browser proxy settings
- **storage**: To save and restore proxy configurations
- **tabs/activeTab**: To apply proxy settings to all tabs
- **scripting**: For potential future features
- **declarativeNetRequest**: For network request handling
- **webRequest/webRequestAuthProvider**: To handle proxy authentication
- **\<all_urls\>**: To apply proxy to all websites

## 📁 Project Structure

```
src/
├── popup/
│   ├── Popup.tsx          # Main React popup component
│   ├── Toast.tsx          # Toast notification component
│   ├── index.tsx          # React entry point
│   └── index.html         # Popup HTML template
├── background/
│   └── background.ts      # Service worker for proxy management
├── lib/
│   ├── storage.ts         # Chrome storage helpers
│   ├── messaging.ts       # Runtime messaging utilities
│   ├── validation.ts      # Input validation logic
│   └── proxy.ts           # Proxy configuration helpers
├── types.d.ts             # Shared TypeScript types
└── index.css              # TailwindCSS styles

public/
└── icons/                 # Extension icons (16, 48, 128px)

dist/                      # Built extension (ready for loading)
├── popup.html
├── popup.js
├── background.js
├── manifest.json
└── icons/
```

## 🔧 Configuration

### Proxy Settings
- **Host**: Supports IPv4, IPv6, and domain names
- **Port**: Must be between 1 and 65535
- **Credentials**: Username and password are optional but both required if authentication is needed

### Validation
- Host format validation (IP addresses and domain names)
- Port range validation
- Credential pairing validation

## 🐛 Troubleshooting

### Common Issues

1. **Extension doesn't load**
   - Ensure Developer mode is enabled
   - Check that all files are in the `dist` folder
   - Look for errors in Chrome DevTools console

2. **Proxy authentication fails**
   - Verify username and password are correct
   - Check if proxy server requires specific authentication method
   - Some proxies may not work with Chrome's authentication mechanism

3. **Network errors after enabling proxy**
   - Verify proxy server is running and accessible
   - Check proxy host and port settings
   - Disable proxy to restore normal connection

4. **Settings not saving**
   - Check Chrome storage permissions
   - Try disabling and re-enabling the extension
   - Check browser's extension storage limits

### Debug Mode

Open Chrome DevTools for the extension:
1. Go to `chrome://extensions/`
2. Find Proxy Manager extension
3. Click "background page" link (for service worker)
4. Click "popup.html" link (for popup debugging)

## 🎨 UI Features

- **Dark Theme**: Elegant dark color scheme with blue accents
- **Glassmorphism**: Subtle transparency and backdrop blur effects
- **Smooth Animations**: Fade and scale animations for better UX
- **Responsive Design**: Optimized for popup dimensions
- **Status Indicators**: Color-coded status pills for quick reference
- **Toast Notifications**: Non-intrusive success/error messages

## 🔮 Future Enhancements

- Multiple proxy profiles with quick switching
- Proxy auto-discovery and testing
- Traffic statistics and monitoring
- Proxy rotation and load balancing
- Import/export settings functionality

## 📄 License

This project is licensed under the MIT License.

## 🙏 Powered by

**HolySuch** - Visit us for more awesome tools and extensions!

---

For support or feature requests, please open an issue in the repository.
