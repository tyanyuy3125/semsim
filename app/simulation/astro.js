// Astronomy simulation module
// Reference:
// Flandern, Thomas C. van and K. F. Pulkkinen. “Low-precision formulae for planetary positions.” 
// Astrophysical Journal Supplement Series 41 (1979): 391-411.
// doi:10.1086/190623
//
// How to compute planetary positions
// https://www.stjarnhimlen.se/comp/ppcomp.html
//
// Approximate Positions of the Planets - NASA
// https://ssd.jpl.nasa.gov/planets/approx_pos.html

import { Vector3 } from "three";

export const AU = 149597870.7; // Astronomical Unit (km)
export const EarthRadius = 6371; // km
export const SunRadius = 695700; // km
export const MoonRadius = 1737.1; // km
const DEG = Math.PI / 180; // degree to radian

function getUTCProportion(date) {
  return date.getUTCHours() / 24 +
         date.getUTCMinutes() / 24 / 60 +
         date.getUTCSeconds() / 24 / 3600;
}

function getDayCount(date) {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  let D = date.getUTCDate();
  //  use interger division
  let d = 367 * y - ~~((7 * (y + ~~((m + 9) / 12))) / 4) -
          ~~((3 * ~~(~~((y + ~~((m - 9) / 7)) / 100) + 1)) / 4) +
          ~~((275 * m) / 9) + D - 730515;
  d += getUTCProportion(date);
  return d;
}

function solveKeplersEquation(M, e) {
    let epsilon = 1e-6;
    let E = M, delta = 1;
    while (Math.abs(delta) > epsilon) {
        delta = E - e * Math.sin(E) - M;
        E = E - delta / (1 - e * Math.cos(E));
    }
    return E;
}

export function getMoonInfo(date) {
  let d = getDayCount(date);

  let N = ( 125.1228 - 0.0529538083 * d ) % 360;
  let i = 5.1454;
  let w = ( 318.0634 + 0.1643573223 * d ) % 360;
  let a = 0.002569562;
  let e = 0.054900;
  let M = ( 115.3654 + 13.0649929509 * d ) % 360;

  M = (M * Math.PI) / 180; // convert to radians
  let E = solveKeplersEquation(M, e);

  let xv = a * (Math.cos(E) - e);
  let yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  let v = Math.atan2(yv, xv) * (180 / Math.PI);
  let r = Math.sqrt(xv * xv + yv * yv);

  let xh = r * (Math.cos(N * DEG) * Math.cos((v + w) * DEG) -
                Math.sin(N * DEG) * Math.sin((v + w) * DEG) *
                Math.cos(i * DEG));
  let yh = r * (Math.sin(N * DEG) * Math.cos((v + w) * DEG) +
                Math.cos(N * DEG) * Math.sin((v + w) * DEG) *
                Math.cos(i * DEG));
  let zh = r * (Math.sin((v + w) * DEG) * Math.sin(i * DEG));

  let lon = Math.atan2(yh, xh) * (180 / Math.PI);
  let lat = Math.atan2(zh, Math.sqrt(xh * xh + yh * yh)) * (180 / Math.PI);
  let rad = Math.sqrt(xh * xh + yh * yh + zh * zh);

  let Ms = ( 356.0470 + 0.9856002585 * d ) % 360;
  let Mm = M;
  let Ls = ( 282.9404 + 4.70935E-5 * d ) % 360 + Ms;
  let Lm = N + w + Mm;
  let D = Lm - Ls;
  let F = Lm - N;

  let lonP = - 1.274 * Math.sin((Mm - 2 * D) * DEG)       // (Evection)
             + 0.658 * Math.sin(2 * D * DEG)              // (Variation)
             - 0.186 * Math.sin(Ms * DEG)                 // (Yearly equation)
             - 0.059 * Math.sin((2 * Mm - 2 * D) * DEG)
             - 0.057 * Math.sin((Mm - 2 * D + Ms) * DEG)
             + 0.053 * Math.sin((Mm + 2 * D) * DEG)
             + 0.046 * Math.sin((2 * D - Ms) * DEG)
             + 0.041 * Math.sin((Mm - Ms) * DEG)
             - 0.035 * Math.sin(D * DEG)                  // (Parallactic equation)
             - 0.031 * Math.sin((Mm + Ms) * DEG)
             - 0.015 * Math.sin((2 * F - 2 * D) * DEG)
             + 0.011 * Math.sin((Mm - 4 * D) * DEG);
  let latP = - 0.173 * Math.sin((F - 2 * D) * DEG)
             - 0.055 * Math.sin((Mm - F - 2 * D) * DEG)
             - 0.046 * Math.sin((Mm + F - 2 * D) * DEG)
             + 0.033 * Math.sin((F + 2 * D) * DEG)
             + 0.017 * Math.sin((2 * Mm + F) * DEG);
  let disP = ((-0.58 * Math.cos((Mm - 2 * D) * DEG) -
              0.46 * Math.cos(2 * D * DEG)) * EarthRadius) / AU;

  lon += lonP;
  lat += latP;
  rad += disP;

  xh = rad * Math.cos(lon * DEG) * Math.cos(lat * DEG);
  yh = rad * Math.sin(lon * DEG) * Math.cos(lat * DEG);
  zh = rad * Math.sin(lat * DEG);

  return {
    position: new Vector3(xh, zh, -yh),
    rotation: lon * DEG + Math.PI, // We assume the moon's front is always facing the earth
    r: r
  };
}

export function getEarthInfo(date) {
  let d = getDayCount(date);

  let w = ( 282.9404 + 4.70935E-5 * d ) % 360;
  let a = 1.000000;
  let e = 0.016709 - 1.151E-9 * d;
  let M = ( 356.0470 + 0.9856002585 * d ) % 360;

  let E = M + e * (180 / Math.PI) * Math.sin(M * DEG) * (1 + e * Math.cos(M * DEG));
  let xv = a * (Math.cos(E * DEG) - e);
  let yv = a * Math.sqrt(1 - e * e) * Math.sin(E * DEG);
  let v = Math.atan2(yv, xv) * (180 / Math.PI);
  let r = Math.sqrt(xv * xv + yv * yv);

  let xh = r * Math.cos((v + w) * DEG);
  let yh = r * Math.sin((v + w) * DEG);

  let pd = getUTCProportion(date);

  let oblecl = 23.4393 - 3.563E-7 * d;

  return {
    position: new Vector3(-xh, 0, yh),
    rotation: (pd + (v + w) / 360 - 0.5) * 2 * Math.PI,
    oblecl: oblecl * DEG,
    r: Math.sqrt(xh * xh + yh * yh)
  };
}

