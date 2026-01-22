import { HardDrive, Star, Trash2, Cloud } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function Sidebar() {
  const location = useLocation(); // To highlight the active button

  const menuItems = [
    { name: 'My Cloud', icon: HardDrive, path: '/dashboard' },
    { name: 'Favorites', icon: Star, path: '/favorites' },
    { name: 'Trash', icon: Trash2, path: '/trash' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center space-x-2 text-primary border-b border-gray-100">
        <Cloud size={28} strokeWidth={2.5} />
        <span className="text-2xl font-bold text-dark">CloudBox</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={clsx(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium",
              location.pathname === item.path
                ? "bg-blue-50 text-primary" // Active Style
                : "text-gray-600 hover:bg-gray-50 hover:text-dark" // Inactive Style
            )}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-primary mb-1">Storage used</p>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full w-[45%]"></div>
          </div>
          <p className="text-xs text-gray-500">4.5 GB of 10 GB</p>
        </div>
      </div>
    </div>
  );
}