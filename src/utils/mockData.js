/**
 * mockData.js
 * Realistic fallback dataset used when the OpenSky Network API is
 * unavailable (rate-limited, CORS error, network down, etc.).
 * Covers a global spread of aircraft in various states.
 */

export const MOCK_FLIGHTS = [
  { icao24:'a0f2d1', callsign:'DAL451 ', country:'United States', longitude:-87.63,  latitude:41.88,  altitude:10668, onGround:false, velocity:245, heading:270, verticalRate:0,    squawk:'2401' },
  { icao24:'3c6754', callsign:'DLH419 ', country:'Germany',       longitude:8.55,    latitude:50.03,  altitude:11278, onGround:false, velocity:252, heading:100, verticalRate:0,    squawk:'3342' },
  { icao24:'400d42', callsign:'BAW117 ', country:'United Kingdom', longitude:-1.48,   latitude:51.48,  altitude:9144,  onGround:false, velocity:238, heading:270, verticalRate:-5,   squawk:'5501' },
  { icao24:'76cd4f', callsign:'ANA007 ', country:'Japan',         longitude:139.77,  latitude:35.68,  altitude:11582, onGround:false, velocity:261, heading:45,  verticalRate:0,    squawk:'0101' },
  { icao24:'c05bed', callsign:'ACA870 ', country:'Canada',        longitude:-79.38,  latitude:43.65,  altitude:8534,  onGround:false, velocity:230, heading:180, verticalRate:3,    squawk:'4412' },
  { icao24:'7bcf37', callsign:'AFR073 ', country:'France',        longitude:2.35,    latitude:48.86,  altitude:10972, onGround:false, velocity:255, heading:310, verticalRate:0,    squawk:'2201' },
  { icao24:'a9b123', callsign:'UAL889 ', country:'United States', longitude:-122.41, latitude:37.77,  altitude:11887, onGround:false, velocity:270, heading:90,  verticalRate:0,    squawk:'7741' },
  { icao24:'48a1c3', callsign:'KLM776 ', country:'Netherlands',   longitude:4.76,    latitude:52.31,  altitude:9753,  onGround:false, velocity:240, heading:225, verticalRate:-8,   squawk:'3122' },
  { icao24:'b1d452', callsign:'QFA002 ', country:'Australia',     longitude:151.21,  latitude:-33.87, altitude:12192, onGround:false, velocity:265, heading:315, verticalRate:0,    squawk:'5602' },
  { icao24:'7c4b55', callsign:'SIA322 ', country:'Singapore',     longitude:103.82,  latitude:1.36,   altitude:10668, onGround:false, velocity:250, heading:270, verticalRate:0,    squawk:'4441' },
  { icao24:'e09f1a', callsign:'IBE3162', country:'Spain',         longitude:-3.70,   latitude:40.42,  altitude:8839,  onGround:false, velocity:225, heading:195, verticalRate:-12,  squawk:'2301' },
  { icao24:'06a092', callsign:'THY45  ', country:'Turkey',        longitude:28.97,   latitude:41.01,  altitude:11278, onGround:false, velocity:258, heading:80,  verticalRate:0,    squawk:'3561' },
  { icao24:'780bf4', callsign:'CCA938 ', country:'China',         longitude:116.40,  latitude:39.91,  altitude:10972, onGround:false, velocity:243, heading:30,  verticalRate:5,    squawk:'1701' },
  { icao24:'3944e7', callsign:'AIC104 ', country:'India',         longitude:77.21,   latitude:28.61,  altitude:9448,  onGround:false, velocity:235, heading:120, verticalRate:-3,   squawk:'4211' },
  { icao24:'a4b2c3', callsign:'AAL202 ', country:'United States', longitude:-73.78,  latitude:40.64,  altitude:0,     onGround:true,  velocity:0,   heading:180, verticalRate:0,    squawk:'1200' },
  { icao24:'f2e31d', callsign:'SWR210 ', country:'Switzerland',   longitude:8.55,    latitude:47.46,  altitude:10058, onGround:false, velocity:248, heading:260, verticalRate:0,    squawk:'5412' },
  { icao24:'c87a12', callsign:'TAM3065', country:'Brazil',        longitude:-43.17,  latitude:-22.91, altitude:7620,  onGround:false, velocity:215, heading:350, verticalRate:10,   squawk:'4321' },
  { icao24:'50e4b2', callsign:'MAS372 ', country:'Malaysia',      longitude:101.71,  latitude:3.15,   altitude:11582, onGround:false, velocity:259, heading:270, verticalRate:0,    squawk:'1401' },
  { icao24:'a3c8f0', callsign:'N123AB ', country:'United States', longitude:-95.37,  latitude:29.99,  altitude:2134,  onGround:false, velocity:75,  heading:90,  verticalRate:12,   squawk:'1301' },
  { icao24:'7f3a12', callsign:'UAE222 ', country:'United Arab Emirates', longitude:55.36, latitude:25.25, altitude:11887, onGround:false, velocity:272, heading:315, verticalRate:0, squawk:'6601' },
  { icao24:'d1e5f7', callsign:'VIR25  ', country:'United Kingdom', longitude:-0.45, latitude:51.48,  altitude:0,     onGround:true,  velocity:0,   heading:90,  verticalRate:0,    squawk:'2000' },
  { icao24:'3a7c12', callsign:'CSN3928', country:'China',         longitude:121.47,  latitude:31.23,  altitude:10668, onGround:false, velocity:247, heading:45,  verticalRate:0,    squawk:'1201' },
  { icao24:'4b2e87', callsign:'JAL408 ', country:'Japan',         longitude:135.50,  latitude:34.69,  altitude:11278, onGround:false, velocity:255, heading:90,  verticalRate:0,    squawk:'0401' },
  { icao24:'e1a234', callsign:'SKY812 ', country:'Greece',        longitude:23.73,   latitude:37.93,  altitude:8534,  onGround:false, velocity:220, heading:200, verticalRate:-7,   squawk:'3421' },
  { icao24:'b0c3e5', callsign:'EIN234 ', country:'Ireland',       longitude:-8.49,   latitude:51.85,  altitude:9144,  onGround:false, velocity:232, heading:275, verticalRate:0,    squawk:'5311' },
  { icao24:'6d1a34', callsign:'AZA256 ', country:'Italy',         longitude:12.49,   latitude:41.90,  altitude:10363, onGround:false, velocity:241, heading:95,  verticalRate:0,    squawk:'3221' },
  { icao24:'9c0e72', callsign:'THA917 ', country:'Thailand',      longitude:100.52,  latitude:13.76,  altitude:9753,  onGround:false, velocity:235, heading:330, verticalRate:4,    squawk:'4511' },
  { icao24:'3e8b1f', callsign:'SAS923 ', country:'Sweden',        longitude:18.07,   latitude:59.65,  altitude:10058, onGround:false, velocity:244, heading:160, verticalRate:0,    squawk:'2711' },
  { icao24:'74d3c2', callsign:'KAL91  ', country:'South Korea',   longitude:126.98,  latitude:37.56,  altitude:11582, onGround:false, velocity:263, heading:60,  verticalRate:0,    squawk:'1101' },
  { icao24:'f9a047', callsign:'EZY6754', country:'United Kingdom', longitude:-1.10, latitude:52.45,  altitude:9144,  onGround:false, velocity:226, heading:185, verticalRate:-9,   squawk:'5201' },
];
