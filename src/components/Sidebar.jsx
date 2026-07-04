import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RiCloseLine} from 'react-icons/ri';
import { HiOutlineMenu} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { links, themes } from '../assets/constants';
import { setTheme, toggleShortcutsHelp } from '../redux/features/playerSlice';

const Logo = ({ accentColor }) => (
  <div className="flex items-center gap-3 select-none px-2 py-1">
    <svg 
      className="w-9 h-9 flex-shrink-0 animate-pulse" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ color: accentColor }}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.2" />
    </svg>
    <span className="text-white font-extrabold text-2xl tracking-wider font-sans">
      Mojo<span style={{ color: accentColor }}>Music</span>
    </span>
  </div>
);

const NavLinks = ({ handleClick }) => {
  const { currentTheme } = useSelector((state) => state.player);
  const themeConfig = themes.find((t) => t.value === currentTheme) || themes[0];

  return (
    <div className="mt-10">
      {links.map((item) => (
        <NavLink
          key={item.name} 
          to={item.to}
          className={({ isActive }) => `flex flex-row justify-start items-center my-8 text-sm
          font-medium ${isActive ? themeConfig.highlight : 'text-gray-400'} ${themeConfig.highlightHover} transition-colors duration-300`}
          onClick={() => handleClick && handleClick()}
        >
          <item.icon className="w-6 h-6 mr-2"/>
          {item.name}
        </NavLink>   
      ))}
    </div>
  );
};

const ThemePicker = ({ currentTheme, handleThemeChange, onShortcutsClick }) => (
  <div className="mt-auto pt-6 border-t border-white/10">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">
        App Theme
      </h3>
      <button
        onClick={onShortcutsClick}
        title="Keyboard Shortcuts"
        className="text-gray-400 hover:text-white transition-colors focus:outline-none flex items-center gap-1.5 text-xs cursor-pointer"
      >
        <span className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold">?</span> Shortcuts
      </button>
    </div>
    <div className="flex flex-row gap-3 flex-wrap">
      {themes.map((t) => (
        <button
          key={t.value}
          type="button"
          title={t.name}
          onClick={() => handleThemeChange(t.value)}
          className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 hover:scale-115 focus:outline-none cursor-pointer ${
            currentTheme === t.value ? 'border-white scale-110' : 'border-white/10'
          }`}
          style={{ backgroundColor: t.colorCircle }}
        />
      ))}
    </div>
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.player);
  const themeConfig = themes.find((t) => t.value === currentTheme) || themes[0];

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return ( 
    <>
      <div className={`md:flex hidden flex-col w-[240px] py-10 px-4 ${themeConfig.sidebar} transition-colors duration-500`}>
        <Logo accentColor={themeConfig.accentColor} />
        <NavLinks />
        <ThemePicker 
          currentTheme={currentTheme} 
          handleThemeChange={handleThemeChange} 
          onShortcutsClick={() => dispatch(toggleShortcutsHelp())}
        />
      </div>

      <div className="absolute md:hidden flex items-center justify-center top-4 right-6 h-[54px] z-50">
        {mobileMenuOpen ? (
          <RiCloseLine className="w-6 h-6 text-white mr-2" 
          onClick = {() => setMobileMenuOpen(false)} />
        ) : (
          <HiOutlineMenu className="w-6 h-6 text-white mr-2"
          onClick = {() => setMobileMenuOpen(true)} />
        )}
      </div>

      <div className={`absolute top-0 h-screen w-2/3 backdrop-blur-lg z-40 p-6 md:hidden
       smooth-transition flex flex-col justify-between ${themeConfig.sidebar} bg-opacity-95 ${mobileMenuOpen ? 'left-0' : '-left-full'} transition-all duration-500`}>
        <div>
          <Logo accentColor={themeConfig.accentColor} />
          <NavLinks handleClick={() => setMobileMenuOpen(false)}/>
        </div>
        <ThemePicker 
          currentTheme={currentTheme} 
          handleThemeChange={handleThemeChange} 
          onShortcutsClick={() => dispatch(toggleShortcutsHelp())}
        />
      </div>
    </>
  );
};

export default Sidebar;
