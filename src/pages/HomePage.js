// src/pages/HomePage.js
import React from 'react';
import Map from '../components/Map';

const HomePage = () => {
  const visitedPlaces = [
    {
      name: 'Paris',
      coords: [48.8566, 2.3522],
      imageLink: 'https://blogger.googleusercontent.com/img/a/AVvXsEjc3T6d_JL5_7cvJhnYZt05sJUf6v5it15CGPhzQDgMLzpTYJJvNTb58IeiMS5S22SRwEBWASRh62YgsAh9Xu0COG3SV1OFHtodmRcBaPUrsyNVxbmllaLht5e2PYgSrXuXxt9FF3Rw3KfbxdkvBhF8_rvKcPReev43F-nyGcihKuoAWM16sbl9KbExuOZS=w392-h523'
    },

    {
      name: 'Milano',
      coords: [45.45913914397633, 9.187069449510059],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Samarkand Railway Station',
      coords: [39.685585339152084, 66.92896822883804],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Galata Korpusu',
      coords: [41.01981742565313, 28.97374089521015],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Topkapi Sarayi',
      coords: [41.01283162137, 28.984137376261444],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Nyhavn, Copenhagen ❤️',
      coords: [55.679203152492306, 12.592077834942733],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Santiago Bernabeu Stadium',
      coords: [40.476943066628905, -3.6151326686744683],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Wanda Metropolitano Stadium',
      coords: [40.43578817901148, -3.600562820267175],
      imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDsFcxaZ6TphewzLHXroTjHNJrp3ha3ks8Ky8kI5wg2c_yy1e9rpemwSfs1bcE2P5yvXtuhq1gB2ZNEPAkMQnBI_M8440xCs8wtAcZK0Es_Jkf7lfko1lI3g1TtjwUF_HFjtuwj4SYgAz7yFh4PBOoYR2rwFJ-GhzmOPUqnNyXIxJCGlhw1BgbsmwAZBvO/s320/photo_2023-08-24_17-47-13.jpg'
    },
    {
      name: 'University of Liverpool ❤️🎓',
      coords: [53.40611160109354, -2.966246349630762],
      imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZ-gSKxKu9nN59x3CDw61foCAWR227Q_MrNAS2RRJ5WyjmGd4hQUaT6w8fyiM608ksQZ32r0l9WZtwE2h03T2Ep7hGMXzi8KIC_Gefk69gpBSEIOrqxwmBMREhsgEmO6IK0LawPDSHG_TQDyAmwK5ROxKtDkvG1NdWmZIF_mjqpuplzz5YFGElx-fDrDM7/s320/121.webp'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Hovuz Square',
      coords: [39.773149809611034, 64.42026384794603],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    
    
    // add more visited places
  ];
  const plannedPlaces = [
    {
      name: 'Tokyo',
      coords: [35.6895, 139.6917],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    // add more planned places
  ];

  return (
    <div>
      <h1>The places I have been to :)</h1>
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
