# CloudBox - Cloud Storage Frontend

A modern, responsive cloud storage application built with React, TypeScript, and Tailwind CSS. This frontend provides an intuitive interface for managing files with features like upload, download, favorites, trash management, and real-time search.

## Features

### User Authentication
- **Login & Registration**: Secure authentication with JWT tokens
- **Session Management**: Persistent login state using localStorage
- **Protected Routes**: Route guards for authenticated-only pages

### File Management
- **Upload**: Drag-and-drop file upload with visual feedback
- **List View**: Grid-based file listing with icons based on file type
- **Search**: Real-time search with 500ms debounce for optimal performance
- **Preview**: Click file names to open in new tab
- **Download**: Force download files with original filename
- **Rename**: Update file names inline
- **Sort**: Sort files by name, size, or date (ascending/descending)

### Organization
- **Favorites**: Star files for quick access
- **Trash Management**: Soft delete with restore capability
- **Permanent Delete**: Remove files permanently from storage

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktops
- **Real-time Notifications**: Toast notifications for all actions
- **Loading States**: Skeleton screens and loading indicators
- **Optimistic UI Updates**: Instant feedback for user actions
- **Smooth Animations**: Polished transitions and hover effects

## Tech Stack

- **Framework**: React 19.2
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 7.12
- **HTTP Client**: Axios 1.13
- **Notifications**: React Hot Toast 2.6
- **File Upload**: React Dropzone 14.3
- **Icons**: Lucide React 0.562
- **Utilities**: 
  - `clsx` for conditional classnames
  - `tailwind-merge` for merging Tailwind classes

## Prerequisites

- Node.js (v20.19.0 or v22.12.0+)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

For production deployment, set `VITE_API_URL` to your production backend URL.

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Lint the code:
```bash
npm run lint
```

## Project Structure

```
client/
├── public/
│   └── vite.svg                # App icon
├── src/
│   ├── assets/
│   │   └── react.svg           # React logo
│   ├── components/
│   │   ├── FileRow.tsx         # Individual file row component
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── UploadModal.tsx     # File upload modal
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main files view
│   │   ├── Favorites.tsx       # Favorite files view
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   └── Trash.tsx           # Deleted files view
│   ├── utils/
│   │   └── format.ts           # Utility functions (file size formatting)
│   ├── api.ts                  # Axios instance with interceptors
│   ├── App.tsx                 # Main app component with routing
│   ├── index.css               # Global styles and Tailwind imports
│   └── main.tsx                # Application entry point
├── .env                        # Environment variables
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md
```

## Component Overview

### FileRow
Displays individual file information with actions:
- File icon based on MIME type
- File name (clickable for preview)
- File size and upload date
- Dropdown menu with actions:
  - Rename
  - Add/Remove from Favorites
  - Share (copy link)
  - Download
  - Delete (move to trash)

### Sidebar
Navigation menu with:
- My Cloud (all active files)
- Favorites (starred files)
- Trash (deleted files)
- Storage usage indicator

### UploadModal
Drag-and-drop file upload interface with:
- Visual feedback for drag state
- Upload progress indication
- Support for all file types

## API Integration

The frontend communicates with the backend via REST API:

```typescript
// API base URL is automatically configured
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// All requests include JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /files` - List all active files
- `GET /files/search?q={query}` - Search files
- `GET /files/trash` - List deleted files
- `POST /files/upload` - Upload file
- `GET /files/:id/link` - Get download link
- `PATCH /files/:id` - Rename file
- `PATCH /files/:id/favorite` - Toggle favorite
- `DELETE /files/:id` - Soft delete (move to trash)
- `POST /files/:id/restore` - Restore from trash
- `DELETE /files/:id/permanent` - Permanently delete

## Styling

The app uses a custom color palette defined in Tailwind config:

```javascript
colors: {
  dark: '#373F51',      // Charcoal (Text/Backgrounds)
  primary: '#008DD5',   // Blue (Buttons/Links)
  light: '#DFBBB1',     // Soft Pink/Beige (Backgrounds)
  accent: '#F56476',    // Salmon (Highlights)
  danger: '#E43F6F',    // Deep Pink (Delete/Errors)
}
```

### Custom Scrollbar
Modern custom scrollbar styling in `src/index.css`:
- 8px width
- Transparent track
- Subtle gray thumb with hover effect

## State Management

The application uses React's built-in state management:

- **Local State**: `useState` for component-specific state
- **Derived State**: `useMemo` for computed values (sorting, filtering)
- **Side Effects**: `useEffect` for data fetching
- **Navigation**: `useNavigate` from React Router
- **Route Info**: `useLocation` for active route highlighting

## Key Features Implementation

### Real-time Search
```typescript
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    fetchFiles(searchQuery);
  }, 500);
  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);
```

### File Sorting
```typescript
const sortedFiles = useMemo(() => {
  return [...files].sort((a, b) => {
    // Custom sorting logic based on sortKey and sortOrder
  });
}, [files, sortKey, sortOrder]);
```

### Optimistic UI Updates
```typescript
// Remove from UI immediately
setFiles((prev) => prev.filter((f) => f.id !== id));

try {
  await api.post(`/files/${id}/restore`);
  toast.success('File restored');
} catch (error) {
  fetchTrash(); // Revert on error
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Debounced Search**: 500ms delay to reduce API calls
- **Optimistic Updates**: Instant UI feedback
- **Memoization**: `useMemo` for expensive computations
- **Image Optimization**: Proper file type icons
- **Lazy Loading**: Components loaded on demand

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states for interactive elements
- Color contrast compliance

## Security Features

- JWT token stored in localStorage
- Automatic token inclusion in API requests
- Protected routes requiring authentication
- Secure file preview (opens in new tab)
- Input validation on forms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript strict mode
- Use functional components with hooks
- Maintain consistent code formatting
- Write meaningful component names
- Keep components small and focused
- Use Tailwind utility classes
- Avoid inline styles

## Known Issues

- None currently reported

## Future Enhancements

- [ ] Folder support
- [ ] File sharing with specific users
- [ ] Multiple file upload
- [ ] File preview modal (images, PDFs)
- [ ] Drag-and-drop file organization
- [ ] Advanced search filters
- [ ] Dark mode
- [ ] Bulk operations
- [ ] File versioning
- [ ] Activity log

## License

ISC

## Author

Siddharth Bhattacharya

## Support

For issues or questions, please open an issue in the repository.
