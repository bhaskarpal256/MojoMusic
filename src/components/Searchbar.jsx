import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

const Searchbar = () => {
  const navigate = useNavigate();
  const { currentTheme } = useSelector((state) => state.player);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState(
    localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : []
  );
  const [isFocused, setIsFocused] = useState(false);

  const themeStyles = {
    'deep-blue': {
      textFocus: 'focus-within:text-cyan-400',
      borderFocus: 'focus-within:border-cyan-500/50',
      tagHover: 'hover:bg-cyan-500/20 hover:border-cyan-500/30',
    },
    'cyberpunk': {
      textFocus: 'focus-within:text-fuchsia-500',
      borderFocus: 'focus-within:border-fuchsia-500/50',
      tagHover: 'hover:bg-fuchsia-500/20 hover:border-fuchsia-500/30',
    },
    'sunset': {
      textFocus: 'focus-within:text-amber-500',
      borderFocus: 'focus-within:border-amber-500/50',
      tagHover: 'hover:bg-amber-500/20 hover:border-amber-500/30',
    },
    'forest': {
      textFocus: 'focus-within:text-emerald-500',
      borderFocus: 'focus-within:border-emerald-500/50',
      tagHover: 'hover:bg-emerald-500/20 hover:border-emerald-500/30',
    },
    'midnight': {
      textFocus: 'focus-within:text-gray-200',
      borderFocus: 'focus-within:border-gray-200/50',
      tagHover: 'hover:bg-gray-200/20 hover:border-gray-200/30',
    },
  };
  const activeStyle = themeStyles[currentTheme] || themeStyles['deep-blue'];

  const quickTags = ['Chill', 'Pop', 'Rock', 'Lo-Fi', 'Focus'];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim();
    let newHistory = [term, ...searchHistory.filter((h) => h !== term)];
    newHistory = newHistory.slice(0, 5); // limit to 5 items
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    setIsFocused(false);
    navigate(`/search/${term}`);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    let newHistory = [tag, ...searchHistory.filter((h) => h !== tag)];
    newHistory = newHistory.slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    setIsFocused(false);
    navigate(`/search/${tag}`);
  };

  return (
    <div className="relative w-full flex flex-col px-6 pr-20 md:pr-6 pt-4 pb-2 bg-transparent">
      <form onSubmit={handleSubmit} autoComplete="off" className={`text-gray-400 ${activeStyle.textFocus} w-full`}>
        <label htmlFor="search-field" className="sr-only">
          Search all songs
        </label>
        <div className={`flex flex-row justify-start items-center bg-[#191624]/40 border border-white/5 ${activeStyle.borderFocus} rounded-xl px-4 py-1 transition-all duration-300`}>
          <FiSearch className="w-5 h-5 ml-2" />
          <input
            name="search-field"
            autoComplete="off"
            id="search-field"
            placeholder="Search songs, artists, genres..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="flex-1 bg-transparent border-none outline-none placeholder-gray-500 text-base text-white p-2.5"
          />
        </div>
      </form>

      {/* History & Tags Dropdown */}
      {isFocused && (
        <div className="absolute top-[68px] left-6 right-6 bg-[#191624] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden backdrop-blur-lg bg-opacity-95 p-4 flex flex-col gap-4">
          {/* Quick Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Tags</span>
            <div className="flex flex-wrap items-center gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-xs text-gray-300 hover:text-white bg-white/5 border border-white/5 rounded-full transition-all duration-300 active:scale-95 ${activeStyle.tagHover}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {searchHistory.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchHistory([]);
                    localStorage.removeItem('searchHistory');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 focus:outline-none"
                >
                  Clear All
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {searchHistory.map((item, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => {
                      setSearchTerm(item);
                      navigate(`/search/${item}`);
                    }}
                    className="px-3 py-2 text-sm text-white hover:bg-white/5 cursor-pointer rounded-lg flex items-center gap-3 transition-colors duration-200"
                  >
                    <FiSearch className="text-gray-500" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
