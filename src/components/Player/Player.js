import React, { useState, useEffect, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Howl } from "howler";
import cloneDeep from "lodash/cloneDeep";
import "./Player.css";
import {
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const Player = (props) => {
  // styles
  const listStyle = {
    root: { backgroundColor: "transparent" },
  };

  const style = {
    maxWidth: 500,
    margin: "auto",
    display: "flex",
    alignItems: "center",
    width: "80%",
  };
  const style2 = {
    margin: 15,
    height: 50,
    WebkitFilter:
      "invert(74%) sepia(86%) saturate(1%) hue-rotate(52deg) brightness(99%) contrast(81%)",
  };
  const style3 = {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: "5px",
    border: 0,
    margin: "10px 0px",
    color: "white",
    height: 40,
    padding: "0 5px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  };
  const soundButtonStyle = {
    borderRadius: "50%",
    height: "60px",
    width: "60px",
    margin: "10px",
  };

  // useState
  const [volume, setVolume] = useState(75);
  const [soundId, setSoundId] = useState({ ocean: 0, birds: 0 });
  const [channelId, setChannelId] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const channels = useRef(props.songs.map((song) => song.src));

  // define Song track using HowlerJS
  useEffect(() => {
    let song;
    if (isPlaying) {
      song = new Howl({
        src: [channels.current[channelId]],
        html5: true,
        loop: true,
        volume: 1,
        onunlock: () => {
          if (!song.playing()) {
            song.play();
          }
        },
      });
      if (!song.playing()) {
        song.play();
        song.fade(0, 1, 2000);
      }
    }

    return () => {
      if (song && song.playing()) {
        song.fade(1, 0, 500);
        song.once("fade", () => {
          song.unload();
        });
      } else if (song) {
        song.unload();
      }
    };
  }, [channelId, isPlaying]);

  // define Sound track using HowlerJS
  // using useRef since the sound track won't change
  const sounds = useRef(
    new Howl({
      src: [
        `${PUBLIC_URL}/music/secondary/background.webm`,
        `${PUBLIC_URL}/music/secondary/background.mp3`,
      ],
      sprite: {
        ocean: [87000, 297804.10430839006, true],
        birds: [0, 85028.57142857142, true],
      },
      volume: volume,
    })
  );

  // a play/stop button for global control
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  // define Sound select botton handler
  const handlePlaySound = (type) => {
    if (type === "none") {
      setSoundId((soundId) => {
        const new_soundId = cloneDeep(soundId);
        Object.keys(new_soundId).map((type) => {
          if (new_soundId[type] !== 0) {
            handlePlaySound(type);
          }
          return true;
        });
        return new_soundId;
      });
    } else if (soundId[type] !== 0) {
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

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectChannel = (index) => {
    setChannelId(() => index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // define Sound volume change handler
  const handleVolumeChange = (volume) => {
    setVolume(volume);
    sounds.current.volume(volume / 100);
  };

  //return player
  return (
    <div className="player">
      <div className="image-container">
        <img
          src={`${PUBLIC_URL}/images/logo.svg`}
          className={`song-image ${!isPlaying ? "paused" : ""}`}
          alt="song"
          onClick={handlePlay}
          // ref={songImage}
        />

        {!isPlaying && (
          <img
            src={`${PUBLIC_URL}/images/Player/play-button-arrowhead.svg`}
            className="play-button"
            alt="playButton"
            onClick={handlePlay}
          />
        )}
      </div>

      <div className="center">
        <List aria-label="Channels" style={listStyle}>
          <ListItem button onClick={handleClickListItem} style={style3}>
            <ListItemText primary={`CHANNEL ${channelId}`} />
          </ListItem>
        </List>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {channels.current.map((src, index) => (
            <MenuItem
              variant="contained"
              color="primary"
              style={style3}
              key={`channel${index}`}
              onClick={() => handleSelectChannel(index)}
              selected={index === channelId ? true : false}
            >
              {`CHANNEL ${index}`}
            </MenuItem>
          ))}
        </Menu>
      </div>

      {/* <button onClick={handlePlay}>{isPlaying ? "Stop" : "Play"}</button> */}

      <Button
        variant="contained"
        color="secondary"
        style={soundButtonStyle}
        key={"sound-reset"}
        className={"sound-reset-button"}
        onClick={() => handlePlaySound("none")}
      >
        None
      </Button>
      {Object.keys(soundId).map((type) => (
        <Button
          variant="contained"
          color="primary"
          style={soundButtonStyle}
          key={type}
          className={`sound-button ${soundId[type] === 0 ? "" : "active"}`}
          onClick={() => handlePlaySound(type)}
        >
          {type}
        </Button>
      ))}
      <br />
      <br />

      {Object.values(soundId).reduce((a, b) => a + b) !== 0 && (
        <div style={style}>
          <Slider onChange={handleVolumeChange} defaultValue={volume} />
        </div>
      )}
    </div>
  );
};

export default Player;
