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
    { name: 'Liverpool Lime Street', coords: [53.4076085, -2.9775854], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzfWXg9lQt2pj3wIbcyWnLnWPGU3qyxDVKw1Xgva7RI_wSc5RFMBCev-ODv5MkEsBztlv6M0u-OlgNl2Tw4TG_ZuqtDD4wbGRcz2ZUG2Uu7NgNBN8M77HLpAGjy2T2B9foJXdUS6tUpsr7L14egFpEDQLFNw-tc2-c9EI3VsaiERuW3Ej3LpI_vUEg46oY/s320/hachiko.png' },
    { name: 'Stamford Bridge Stadium', coords: [51.481686499999995, -0.19103517666346065], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghzbP3ppLImNNZQghA7R1TFTgPuPd0kIydru4EEDM7Tue8OOoi6KZhSzhQewXMyVAn6jXdXRqdrwxyKAi4EjCHdVzdIFOg6e9AXMopoSId2hyIBOh58kXeXc2sI7Vk_cu0lHJHmAtilhKYHOJgC79wvL4VSyLQPj_7b60VlOcz16LuRbp0vvfgnk4IdwSs/w437-h437/chel.jpg' },
    { name: 'Santiago Bernabeu Stadium', coords: [40.4523667, -3.6907254], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8FzWKu5WDrW9ZYBBautwn7HRiuCUK6k-hI8UyM0jCi6cwo3lVim1U1ZuxWJlpszcQfX2tMRZvb4pMuqRKZDB2EIFJlf0AiEBzhoIo4gbB8MbcxFVbjIiEZe_Cdu69ALn-AgSXIbkrBwTZDrikLFm2PBrnGLqhg3uxxFogdyRpbz0nnjdNW4glAhWTuzc_/w384-h384/pic3.png' },
    { name: 'Etihad Stadium 🩵', coords: [53.48309105, -2.2002520023433307], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_2B9T1c9ecq6sgegcYdB-JqF2YVOX8wGEsCB7vbYx4ZSp4okLM1rJJn2Fr1VBwhd2-5kvRcG3TKFXWnvpmCP1yfYyMfnp6djZ4wEoQtBlt700ZCnfhdQL-AqBoZqLO8Mnk2Mjpv3wPjeXETvCOzZHDBdtRpCldjJ0lJfioYRiWpLPQdbhUedbvgIFKAfm/w301-h472/1.jpg' },
    { name: 'Sherlock`s House, Baker Street', coords: [51.5237629, -0.1584743], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgz50hezAN9SuvkYi9hQjLg2F-am3FSQiZBvxvPus-P8rcl0wSCZzsDVxJYGh2ppoh_coQJDCNMYMbM7f8wwS6tlxQ1Pjm28ucYmcOTEqk-q4a8O6IkVKMDjncffzg_-lQqXzxB7-4vY0K3pKUoh0HlV9GxBr4pY0M3vLTTiiFr-nyWRWLDYxogafdGLiow/w277-h616/20221222_113534.jpg' },
    { name: 'El Principe Restaurante, Madrid', coords: [40.4141634, -3.7000816], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizSdkVDVxnrCMhs6bMX2so39R4-U_oEWCVd6D4SzKjNCEPGH4GD0hI14HRtaQK-Gnb48cY70aLXj49eeoGNSyOD9YG5jM7gepQW_E3Rmvrrxhbw9bbmQKe68PSzXlZbqOEVyJj3puBcBcJOdRYYfu4jbVVCHvv4OsaHrjNizzLbIu_Q2i-4tUlftk1CQrf/w497-h663/20230811_220557.jpg' },
    { name: 'Wanda Metropolitano Stadium', coords: [40.43503136007304, -3.600726127624512], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDsFcxaZ6TphewzLHXroTjHNJrp3ha3ks8Ky8kI5wg2c_yy1e9rpemwSfs1bcE2P5yvXtuhq1gB2ZNEPAkMQnBI_M8440xCs8wtAcZK0Es_Jkf7lfko1lI3g1TtjwUF_HFjtuwj4SYgAz7yFh4PBOoYR2rwFJ-GhzmOPUqnNyXIxJCGlhw1BgbsmwAZBvO/s320/photo_2023-08-24_17-47-13.jpg' },
    { name: 'University of Liverpool ❤️🎓', coords: [53.40611160109354, -2.966246349630762], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZ-gSKxKu9nN59x3CDw61foCAWR227Q_MrNAS2RRJ5WyjmGd4hQUaT6w8fyiM608ksQZ32r0l9WZtwE2h03T2Ep7hGMXzi8KIC_Gefk69gpBSEIOrqxwmBMREhsgEmO6IK0LawPDSHG_TQDyAmwK5ROxKtDkvG1NdWmZIF_mjqpuplzz5YFGElx-fDrDM7/s320/121.webp' },
    { name: 'Beautiful Chester 😻', coords: [53.1908873, -2.8908955], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXOrbZd07ixubpijDX8fo5Zum4rE3dSNpvVca4Rup-TmW3ggdrZOZFYRKBj6oFMQjb3WGhg5KSU4R_M1aLS7kxlbdNYTWH5cxcuY7ZboxK5aQBeLQF-25T1GdxMViGi7L1WtE9buHBELopevjg-k8eIFduZDybUrHhhN2qn6CATW9fz4kd9OmbFbpsjL_4/w440-h587/photo_2024-07-28_15-33-00.jpg' },
    { name: 'George Square, Glasgow', coords: [55.86115665, -4.250218902542482], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5yiegpbL8XJfIfj2nRGM3s-18Ysc4ipJyUG5SJpabX_h7hyphenhyphenF9InYU22iUplermNTwbbyKBIkqZQgdLS9HmGbcTsshoV4s5iwVQnxckb0klBUOBdkm_y-NqoQVN0bFX8oJZ_SInll5lt-bLxQ3ykgcVBj1iWubO5B2IOShqD1nF1vNDq6K1i7qjv3LS-rB/w435-h580/photo_2024-07-28_15-32-50.jpg' },
    { name: 'San Siro Stadium 🏟️', coords: [45.478200349999995, 9.123963993342393], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgASsUAt2k9s1V8t78KAMkhpLM-bth5LCaFp5v7oFsUWkc4KnujDWWS7qc8UaqMSl6s5OJ39DxwaCHh97cafsbHJRqaNFGUcNwBZdgQoAjdsvhcDIbbWAtAxYpm7LXRKJhrio_q4yK2lOnM-ix4NMu2jUsdG7pFS_52QRS-6q3fS-IhUco8TRESglM-0TBw/w414-h449/photo_2024-07-28_15-32-38.jpg' },
    { name: 'Llandudno, Wales ', coords: [53.33151996613546, -3.8251411914825444], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6V33tqCggT0H5B5zGrXk4OuugyLQNIF-ROKt9_DtDsn4WSIEvhD6zzVdS0p1rwx4cI857c9ZXv6HB9zzvZVA7Gf0rkXsnNKt288HXI-B1_B577lGsgaKwruKP0C0PjvEwFpeeaajOA5mq0jRgVQsSPKQhRryBMVgRdEisQjSGZVC69pfM8LL9WV6PxEol/w438-h584/photo_2024-07-28_15-32-47.jpg' },
    { name: 'Edinburgh Castle ', coords: [55.948686699999996, -3.2004174629518065], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCOLr1lTkfIzzJbbIvUcfumVGZ-mLlyUny5P3-pKCaCW7kTeGoFfs1KGJ939XmcaSRty1r_wmhnNiurcd7BCcJI19R_FgEDM_rbrMUksCo9kfpuxUIIsFsVpoaXp0Z1bnOolreBMTSv9EN1SPxmB91jXUyFGoz1W1U-PDWQxA2S7srZwAhs1foWYRb9Jdt/w459-h612/photo_2024-07-28_15-32-55.jpg' },
    { name: 'Samarkand Railway Station', coords: [39.6855379, 66.9289120568356], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjb6ZSz8-QnKLB751LR7hRAaY62805fwE6tTUUUHIfgjtbeomQ-hKK9ReekLHtuya0-mdrW4rBU3_OrCXEhlh7kNZESDO1JLzsGlbCoF65yYeg73ERFME05aD4i1wadNYOQ3_y6x1SngGjsKdA-UHWr4wkuyrpmZFM5x-Fo0vLgWVKFEU2V1zrLYoqadR9a/w428-h570/photo_2024-07-28_15-32-33.jpg' },
    { name: 'Old Trafford Stadium 🏟️', coords: [53.46310955, -2.2913864850545362], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhofbIsGXjPi-qObA45gHGGkZFkmf9zLcmsllapOi8MsSbA2mLZffGD_1EgAAbN5ajXOlzANyJrL8SYV_Q-JcTXzBt7zZflGiYffvUmzhRXEkW03apyIObLzOO7oPXho18o2GN1XlvOBuy4_wMZ3WGOC9Ao3x9X_g1cyuEUR79sFpJyo-Ci8cICo1YbM2oE/w448-h597/photo_2024-07-28_15-32-42.jpg' },
    { name: 'Nyhavn, Copenhagen ❤️', coords: [55.67973595, 12.590885478619983], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEioRIb20PjXB1oG13XS79VXJffXelyRTEp6snx4fRLH9ttDH9irzkqS14plHQbPmeoc3phItgPCT6CsoeP5WHRTyedOssBcyokGkgToorKrL6I1CMbaezGPg3vBzBw_ahNu_kee3DpGpOQqdv-2Ok8KGZ8IPIiKB-SQ4vYlQf6TeR_NzTuY84Mma33z067j/w601-h411/photo_2024-07-28_15-49-17.jpg' },
    { name: 'Sleep In Heaven 📸🏆', coords: [55.6867883, 12.5505333], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4_aWNSB-Qt1bI7on2JRSvKoBXIXAVVnTEtRfUAFmppKhXM0NGYwVRqvPuIoIUMQyX9KJIYGUyZhBmChTVaCHtkkOimkzh8dHy7he0ksmYljn6Cx4xCBD30zfh7_rQ8pO_CyzZqmaG5y0BAhHiLbmgjITUaFaVPbqlTFBg_2C1Kb3G3Sll3jfdXpAfjhZj/w519-h692/photo_2024-07-28_15-51-54.jpg' },
    { name: 'Copenhagen Airport', coords: [55.62565886710453, 12.648696899414064], imageLink: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNc95qezJx9QQLvu54uo7g7Mht-rhMfQfzqPAcPALpeQ_lUWha33-PVJTOvUmFGxcUbxHGSXIDW2DET7I3oR6dX5rj4e8ThFcOMshrFkTg7n4HGpuGFYuEgYDKljJZWwRM1mmjze85WO5eSSpJ0Zi9seKapCghFYxKVKtzFlT9uIVAGbOJDq4WtodUjxEA/w458-h682/photo_2024-07-28_15-55-59.jpg' },
    { name: 'Galata Korpusu', coords: [41.0182562, 28.9717712], imageLink: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/16/d3/68/caption.jpg?w=1200&h=1200&s=1' },
    { name: 'Topkapi Sarayi', coords: [41.011344, 28.9832034], imageLink: 'https://beyogluhuzursuites.com/wp-content/uploads/2023/03/topkapi-sarayi-muzesi.png' },
    { name: 'Tashkent State Transport University 🎓', coords: [41.27729075, 69.2826682070976], imageLink: 'https://tstu.uz/assets/front/images/tstuphoto.jpg' },
    { name: 'Tashkent Railway Station', coords: [41.2932886, 69.2877212], imageLink: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Tashkent_Railway_Station.jpg' },
    { name: 'Uzbekistan Locomotive Depot', coords: [41.17858174722078, 69.12394344806673], imageLink: 'https://tashtrans.uz/photo/railway/depo/DSC_0004.jpg' },
    { name: 'Bulungur 💚', coords: [39.76059340816414, 67.27417945861818], imageLink: 'https://i.ytimg.com/vi/5ko2xpNPV4U/maxresdefault.jpg' }


  ];

  // ---------------------------------------------------------------------------------------------- ✈️ PLANNED PLACES BELOW 

  const plannedPlaces = [
    { name: 'Daejeon, South Korea', coords: [36.3352732, 127.45293497231432], imageLink: 'https://facts.net/wp-content/uploads/2023/07/50-facts-about-daejeon-taejon-1688365652.jpg' },
    { name: 'Tokyo, Japan', coords: [35.6821936, 139.762221], imageLink: 'https://www.travelandleisure.com/thmb/VscfMXHNO6uBpaX2cuIW1q2ZtA8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tokyo-japan-TOKYOTG0621-52012ff551dc46c4a87ac8e3151307a4.jpg' },
    { name: 'Phuket, Thailand', coords: [7.879982497172296, 98.38960647583008], imageLink: 'https://miro.medium.com/v2/resize:fit:1000/0*fY1_mh4P45v1EYdX.jpg' },
    { name: 'Kuala Lumpur, Malaysia', coords: [3.1516964, 101.6942371], imageLink: 'https://media.timeout.com/images/105866262/750/562/image.jpg' },
    { name: 'Sydney, Australia', coords: [-33.8698439, 151.2082848], imageLink: 'https://static1.squarespace.com/static/55ee34aae4b0bf70212ada4c/57d9829837c5819632bc630b/5e06e89e74877f00dbb21494/1577545446402/keith-zhu-qaNcz43MeY8-unsplash+%281%29.jpg?format=1500w' },
    { name: 'Mecca, Saudi Arabia', coords: [21.420847, 39.826869], imageLink: 'https://cdn.britannica.com/20/153520-050-177A78E4/Kabah-hajj-pilgrims-Saudi-Arabia-Mecca.jpg' },

  ];

  return (
    <div>
      <h1>The places I have been to :)</h1>
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
