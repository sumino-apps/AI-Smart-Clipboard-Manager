# AI-Smart-Clipboard-Manager

A modern, intelligent clipboard manager built with React, TypeScript, and Vite. Effortlessly manage your clipboard history with AI-powered tagging, automatic categorization, and smart search capabilities.

## Features

✨ **Smart Features:**
- 📋 **Clipboard History** - Automatically track and manage your clipboard history
- 🤖 **AI Auto-Tagging** - Intelligent automatic tagging of clipboard content
- 🏷️ **Auto-Categorization** - Automatic detection and categorization of content types
- 🔍 **Advanced Search** - Quick and powerful search across your clipboard history
- 📌 **Pin Important Items** - Pin frequently used items for quick access
- 🎨 **Dark Mode Support** - Eye-friendly dark theme toggle
- ⌨️ **Keyboard Shortcuts** - Quick access with customizable keyboard shortcuts
- 🔒 **Privacy First** - Detects and handles sensitive information safely
- 📊 **Analytics** - View insights about your clipboard usage
- 📤 **Export** - Export your clipboard history in multiple formats

## Tech Stack

- **Frontend:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + PostCSS
- **Storage:** IndexedDB for local data persistence
- **State Management:** Custom React hooks with Zustand
- **UI Components:** Custom components with accessibility in mind

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sumino-apps/AI-Smart-Clipboard-Manager.git
cd AI-Smart-Clipboard-Manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally
- `pnpm run lint` - Run ESLint (if configured)

## Project Structure

```
src/
├── app/                 # Main application component
├── features/
│   └── clipboard/       # Clipboard manager feature
│       ├── components/  # React components
│       ├── hooks/       # Custom hooks
│       ├── services/    # Business logic
│       ├── store/       # State management
│       ├── types/       # TypeScript types
│       └── utils/       # Utilities
└── shared/             # Shared components and hooks
    ├── components/     # Common components
    ├── hooks/          # Common hooks
    └── lib/            # Utility functions
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Open Clipboard Manager |
| `Ctrl+K` | Open Command Palette |
| `Ctrl+F` | Focus Search |
| `Esc` | Close dialogs |

## Usage

1. **Copy Content** - Copy text, links, or code as usual
2. **View History** - Open the Clipboard Manager to see your history
3. **Search & Filter** - Use the search bar or filter by category
4. **Pin Items** - Click the pin icon to save important items
5. **Export** - Export your clipboard history as JSON, CSV, or text

## Storage

All data is stored locally in your browser using IndexedDB. Your clipboard history never leaves your device.

## Privacy & Security

- ✅ No cloud storage or external servers
- ✅ Automatic sensitive data detection
- ✅ No telemetry or tracking
- ✅ All processing happens locally in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## About Sumino Apps

This project is maintained by [Sumino Apps](https://github.com/sumino-apps) - crafting intelligent solutions for everyday productivity challenges.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions, please open an [issue](https://github.com/sumino-apps/AI-Smart-Clipboard-Manager/issues).

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons and inspiration from the open-source community

---

**Made with ❤️ by Sumino Apps for clipboard management**
