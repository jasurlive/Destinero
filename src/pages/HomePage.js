// src/pages/HomePage.js
import React from 'react';
import Map from '../components/Map';

const HomePage = () => {


  // ---------------------------------------------------------------------------------------------- 🚩 VISITED PLACES BELOW

  const visitedPlaces = [
    { name: 'Eiffel Tower, Paris', coords: [48.8582599, 2.2945006358633115], imageLink: 'https://jasurlive.uz/pic2.png' },
    { name: 'Vertical Forest in Milano City', coords: [45.45913914397633, 9.187069449510059], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjopGWMQwXjFcqhYZwCIg2p0yTcxJap8yEQeZUBww_BUIDih3s0CirCYIOssac2OykY7Guoo0RaOUec7l3oT-6SvQkE8-Dm3YjrwEzZ14JMxku3Hnx3zm-QyBUbbbDpxKgtIyqOzISoG6XvzC1_ph-4a9U2QrRoFazPTL-OeF7Jl_AYAmh663JuQGsQ3gPA/w381-h508/bosco.jpg' },
    { name: 'Galata Bridge', coords: [41.01978632234401, 28.97251904010773], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvCKEsz5vl8HZFdlUQiwQG6J_dbPXl22DdAhQ96W4-T1rAsREyUkXFAKvqTMNDtk4qR6KNqjY6fCOL7otlKgrbuiXXfCFNDL9WlInMLrUsOBExDtmJl4lOJORXpGWG3jb-jp5B2VI5oCRTMhhxcd-y1H9-J-xHap0xTPWu-mDYe-6p2WLkRTAD41q_DLLG/s320/20230927_152908.jpg' },
    { name: 'Emirates Stadium', coords: [51.55504035, -0.1083996708672374], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOF6_gTwDvNkjcK6lfoibyExMVYRh1IlunmBwV0_qADTVTNYAh6-my7wVowz_vCl31owtAE9Cz2omvjsFEnOHNIK66UTl2d3NmezuYmZ5ZnaLgAtS85bqAX5l4RUB2ZQXivCQ1sGXQ7NLrr0kpE9wTGmvUGtD_mEBtZJGLDGMY7DMyV7ADRPGO9o_k7LKq/s320/23.webp' },
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
      name: 'Tashkent State Transport University 🎓',
      coords: [41.27693714733493, 69.28171277402497],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Tashkent Railway Station',
      coords: [41.2913087415986, 69.28667534081151],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Uzbekistan Locomotive Depot',
      coords: [41.17574792500475, 69.11880335418036],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Uzbekistan Station',
      coords: [41.163629680198014, 69.10566899226976],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Bakhmal Mountains',
      coords: [40.06385884843086, 67.66027812330306],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'My Hometown Bulungur',
      coords: [39.76044032081304, 67.27410899466418],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'SKD Samarkand Airport',
      coords: [39.69699001918824, 66.99105567261223],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Manchester City Centre',
      coords: [53.481441143861986, -2.241878696210726],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Etihad Stadium 🩵',
      coords: [53.48008917865102, -2.188915220594217],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Edinburgh Castle',
      coords: [55.94874783939112, -3.1972694492410407],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'George Square',
      coords: [55.86128839286419, -4.25139556409707],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Stamford Bridge',
      coords: [51.481677827759704, -0.1910727052852046],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Labi Havuz',
      coords: [39.77293970560981, 64.42026031484833],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Chess Zone',
      coords: [39.77660859167944, 64.40767551926113],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Bukhara Railway Station',
      coords: [39.72203509321687, 64.54730580949321],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Karshi Railway Station',
      coords: [38.82143810300877, 65.77712549039398],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Llandudno, Wales',
      coords: [53.33167645251945, -3.824942414958144],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Lufthavnen Metro Station',
      coords: [55.63088645629893, 12.649230953933992],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Sitting area right next to Nyhavn',
      coords: [55.68056896609491, 12.586611332352101],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Sleep in Heaven Hostel 📸🏆',
      coords: [55.686776555367054, 12.550551789427477],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Orly Airport Shuttle Bus Station',
      coords: [48.72857124101419, 2.3690825209465283],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'PSG Stadium Tour',
      coords: [48.841320752408244, 2.2531545190717095],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    

  ];

  // ---------------------------------------------------------------------------------------------- ✈️ PLANNED PLACES BELOW 

  const plannedPlaces = [
    {
      name: 'Tokyo, Japan',
      coords: [35.6895, 139.6917],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Daejeon, South Korea',
      coords: [36.46695000206827, 127.2868698610206],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Phuket, Thailand',
      coords: [7.883604720685977, 98.38892563265334],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },
    {
      name: 'Tokyo',
      coords: [35.6895, 139.6917],
      imageLink: 'https://jasurgraduate.blogspot.com/'
    },

  ];

  return (
    <div>
      <h1>The places I have been to :)</h1>
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
