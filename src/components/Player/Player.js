import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "react-use";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Howl, Howler } from "howler";
import cloneDeep from "lodash/cloneDeep";
import "./Player.css";

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const Player = (props) => {
  const style = {
    maxWidth: 500,
    margin: "auto",
    display: "flex",
    alignItems: "center",
  };
  const style2 = {
    margin: 15,
    height: 50,
    WebkitFilter:
      "invert(74%) sepia(86%) saturate(1%) hue-rotate(52deg) brightness(99%) contrast(81%)",
  };
  const [volume, setVolume] = useState(75);
  const [soundId, setSoundId] = useState({ birds: 0, ocean: 0 });
  const [channelId, setChannelId] = useState(0);

  const channels = useRef(props.songs.map((song) => [song.src]));
  console.log(channels);

  // load song_src and sound_src
  // const [song_src] = useState(props.songs[0].src);

  // define Song track using HowlerJS
  useEffect(() => {
    const song = new Howl({
      src: [channels.current[channelId]],
      html5: true,
      loop: true,
      volume: 1,
      onunlock: () => {
        if (!song.playing()) {
          song.play();
          song.fade(0, 1, 2000);
        }
      },
      // onplayerror: function () {
      //   song.once("unlock", function () {
      //     console.log(song.playing());
      //     if (!song.playing()) {
      //       song.play();
      //     }
      //   });
      // },
    });
    if (!song.playing()) {
      song.play();
      song.fade(0, 1, 2000);
    }
    return () => {
      song.unload();
    };
  }, [channelId]);

  // define Sound track using HowlerJS
  // using useRef since the sound track won't change
  const sounds = useRef(
    new Howl({
      src: [
        `${PUBLIC_URL}/music/secondary/background.webm`,
        `${PUBLIC_URL}/music/secondary/background.mp3`,
      ],
      sprite: {
        birds: [0, 85028.57142857142, true],
        ocean: [87000, 297804.10430839006, true],
      },
      volume: volume,
    })
  );

  // define Sound select botton handler
  const playSoundHandler = (type) => {
    if (soundId[type] !== 0) {
      sounds.current.fade(1, 0, 1000, soundId[type]);
      sounds.current.once(
        "fade",
        () => {
          sounds.current.stop(soundId[type]);
        },
        soundId[type]
      );
      setSoundId((soundId) => {
        const new_soundId = cloneDeep(soundId);
        new_soundId[type] = 0;
        return new_soundId;
      });
    } else {
      const id = sounds.current.play(type);
      sounds.current.fade(0, 1, 1000, id);
      setSoundId((soundId) => {
        const new_soundId = cloneDeep(soundId);
        new_soundId[type] = id;
        return new_soundId;
      });
    }
  };

  const selectChannelHandler = (index) => {
    setChannelId(() => index);
  };

  // define Sound volume change handler
  const volumeChangeHandler = (volume) => {
    setVolume(volume);
    // song.volume(1 - volume / 100);
    sounds.current.volume(volume / 100);
    console.log(sounds.current);
  };

  //return player
  return (
    <div className="player">
      <img
        src={`${PUBLIC_URL}/images/logo.svg`}
        className="App-logo"
        alt="logo"
      />
      <br />
      <br />
      {channels.current.map((src, index) => (
        <button
          key={`channel${index}`}
          onClick={() => selectChannelHandler(index)}
        >
          {`channel${index}`}
        </button>
      ))}

      <br />
      {Object.keys(soundId).map((type) => (
        <button key={type} onClick={() => playSoundHandler(type)}>
          {soundId[type] === 0 ? type : "stop"}
        </button>
      ))}

      <div style={style}>
        <img
          src={`${PUBLIC_URL}/images/music.png`}
          style={style2}
          alt={"music"}
        />
        <Slider onChange={volumeChangeHandler} defaultValue={volume} />
        <img
          src={`${PUBLIC_URL}/images/background.png`}
          style={style2}
          alt={"background"}
        />
      </div>
    </div>
  );
};

export default Player;
