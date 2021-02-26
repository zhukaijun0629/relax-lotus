import React, { useState, useRef } from "react";
import { useAudio } from "react-use";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const Player = (props) => {
  console.log(props.sounds);

  const style = { maxWidth:500, margin: "auto", display:'flex', alignItems:'center'};
  const style2 = { margin:15, height:50, WebkitFilter: 'invert(74%) sepia(86%) saturate(1%) hue-rotate(52deg) brightness(99%) contrast(81%)'};
  const [volume,setVolume] = useState(50);

  // load song_src and sound_src
  const song_src = props.songs[0].src;
  const sound_src = props.sounds[0].src;

  // useAudio hooks for song and sound
  const [song, song_state, song_controls, song_ref] = useAudio({
    src: song_src,
    autoPlay: true,
  });
  const [sound, sound_state, sound_controls, sound_ref] = useAudio({
    src: sound_src,
    autoPlay: true,
    loop: true,
  });

  const playHandler = () => {
    song_controls.play();
    sound_controls.play();
  };

  const volumeChangeHandler = (volume) => {
    setVolume(volume)
    song_controls.volume(1 - volume / 100);
    sound_controls.volume(volume / 100);
  };

  return (
    <div className="player">
      <img
        src={`${PUBLIC_URL}/images/logo.svg`}
        className="App-logo"
        alt="logo"
      />
      <br />
      <br />
      <br />
      {song}
      {/* <pre>{JSON.stringify(song_state, null, 2)}</pre> */}
      {sound}
      {/* <pre>{JSON.stringify(sound_state, null, 2)}</pre> */}
      <button onClick={playHandler}>Play</button>
      <div style={style}>
        <img src={`${PUBLIC_URL}/images/music.png`} style={style2} alt={"music"}/>
        <Slider
          onChange={volumeChangeHandler}
          defaultValue={volume}
          startPoint={50}
        />
        <img src={`${PUBLIC_URL}/images/background.png`} style={style2} alt={"background"}/>
      </div>
    </div>
  );
};

export default Player;
