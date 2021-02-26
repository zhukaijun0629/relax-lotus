import {useState, useEffect} from 'react';
import "./App.css";
import Player from './components/Player/Player';

import music from './data/music'
import background from './data/background'



const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

function App() {
  const songs = music
  const sounds = background



  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [nextSongIndex, setNextSongIndex] = useState(0);

  useEffect(() => {
    setNextSongIndex(() => {
      if (currentSongIndex + 1 > songs.length - 1) {
        return 0;
      } else {
        return currentSongIndex + 1;
      }
    });
  }, [currentSongIndex, songs.length]);

  return (
    <div className="App center">
      <Player 
        currentSongIndex={currentSongIndex} 
        setCurrentSongIndex={setCurrentSongIndex} 
        nextSongIndex={nextSongIndex} 
        songs={songs}
        sounds={sounds}
      />

    </div>
  );
}

export default App;
