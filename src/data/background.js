const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const data = [
  {
    id: 0,
    title: "Birds Chirping",
    artist: "http://www.freesoundslibrary.com",
    img_src: `${PUBLIC_URL}/images/secondary/birds-chirping.jpg`,
    src: `${PUBLIC_URL}/music/secondary/birds-chirping.mp3`,
  },
  {
    id: 1,
    title: "Ocean Waves",
    artist: "http://www.freesoundslibrary.com",
    img_src: `${PUBLIC_URL}/images/secondary/ocean-waves.jpg`,
    src: `${PUBLIC_URL}/music/secondary/ocean-waves.mp3`,
  },
];

export default data;