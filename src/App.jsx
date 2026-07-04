import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Searchbar, Sidebar, MusicPlayer, TopPlay, ShortcutsHelpModal } from './components';
import { ArtistDetails, TopArtists, AroundYou, Discover, Search, SongDetails, TopCharts, Favorites } from './pages';
import { themes } from './assets/constants';
import { toggleShortcutsHelp } from './redux/features/playerSlice';

const App = () => {
  const dispatch = useDispatch();
  const { activeSong, currentTheme, shortcutsHelpOpen } = useSelector((state) => state.player);
  const themeConfig = themes.find((t) => t.value === currentTheme) || themes[0];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if user is typing in input or textarea
      const targetTag = e.target.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        dispatch(toggleShortcutsHelp());
      } else if (e.key === 'Escape' && shortcutsHelpOpen) {
        dispatch(toggleShortcutsHelp());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutsHelpOpen]);

  return (
    <div className="relative flex h-[100dvh] w-full overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${themeConfig.background} overflow-hidden`}>
        <Searchbar />

        <div className={`px-6 h-[calc(100vh-72px)] overflow-y-scroll overflow-x-hidden hide-scrollbar flex xl:flex-row flex-col-reverse ${activeSong?.title ? 'pb-32' : 'pb-6'}`}>
          <div className="flex-1 h-fit">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/top-charts" element={<TopCharts />} />
              <Route path="/around-you" element={<AroundYou />} />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>

      {activeSong?.title && (
        <div className={`fixed h-24 sm:h-28 bottom-0 left-0 md:left-[240px] right-0 flex animate-slideup bg-gradient-to-br ${themeConfig.playerBackground} backdrop-blur-lg rounded-t-3xl z-30`}>
          <MusicPlayer />
        </div>
      )}

      <ShortcutsHelpModal isOpen={shortcutsHelpOpen} onClose={() => dispatch(toggleShortcutsHelp())} />
    </div>
  );
};

export default App;
