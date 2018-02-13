import { opacify } from 'polished';

// Reds
export const R50 = '#FFEBE6';
export const R75 = '#FFBDAD';
export const R100 = '#FF8F73';
export const R200 = '#FF7452';
export const R300 = '#FF5630';
export const R400 = '#DE350B';
export const R500 = '#BF2600';

// Yellows
export const Y50 = '#FFFAE6';
export const Y75 = '#FFF0B3';
export const Y100 = '#FFE380';
export const Y200 = '#FFC400';
export const Y300 = '#FFAB00';
export const Y400 = '#FF991F';
export const Y500 = '#FF8B00';

// Greens
export const G50 = '#C7F9EA';
export const G75 = '#90F2D7';
export const G100 = '#5DEFD3';
export const G200 = '#3ED3B6';
export const G300 = '#2F9B85';
export const G400 = '#00695C';
export const G500 = '#00473F';

// Blues
export const B50 = '#DEEBFF';
export const B75 = '#B3D4FF';
export const B100 = '#4C9AFF';
export const B200 = '#2684FF';
export const B300 = '#0065FF';
export const B400 = '#0052CC';
export const B500 = '#0747A6';

// Purples
export const P50 = '#EAE6FF';
export const P75 = '#C0B6F2';
export const P100 = '#998DD9';
export const P200 = '#8777D9';
export const P300 = '#6554C0';
export const P400 = '#5243AA';
export const P500 = '#403294';

// Teals
export const T50 = '#E6FCFF';
export const T75 = '#B3F5FF';
export const T100 = '#79E2F2';
export const T200 = '#00C7E6';
export const T300 = '#00B8D9';
export const T400 = '#00A3BF';
export const T500 = '#008DA6';

// Neutrals
export const N0 = '#FFFFFF';
export const N10 = '#EFF4F3';
export const N20 = '#E0EAE8';
export const N30 = '#D1DFDD';
export const N40 = '#C2D5D2';
export const N50 = '#B3CBC7';
export const N60 = '#A4C0BB';
export const N70 = '#95B6B0';
export const N80 = '#86ABA5';
export const N90 = '#77A19A';
export const N100 = '#68978F';
export const N200 = '#5B8982';
export const N300 = '#4F7C75';
export const N400 = '#426F68';
export const N500 = '#36625B';
export const N600 = '#2A554E';
export const N700 = '#1D4841';
export const N800 = '#113B34';
export const N900 = '#052E27';

// Each tint is made of N900 and an alpha channel
export const N10A = opacify(0.02, N900);
export const N20A = opacify(0.04, N900);
export const N30A = opacify(0.08, N900);
export const N40A = opacify(0.13, N900);
export const N50A = opacify(0.25, N900);
export const N60A = opacify(0.31, N900);
export const N70A = opacify(0.36, N900);
export const N80A = opacify(0.42, N900);
export const N90A = opacify(0.48, N900);
export const N100A = opacify(0.54, N900);
export const N200A = opacify(0.60, N900);
export const N300A = opacify(0.66, N900);
export const N400A = opacify(0.71, N900);
export const N500A = opacify(0.77, N900);
export const N600A = opacify(0.82, N900);
export const N700A = opacify(0.89, N900);
export const N800A = opacify(0.95, N900);

// Themed colors
export const background = N0;
export const text = N900;
export const subtleText = N300;
export const placeholderText = N100;
export const heading = N800;
export const subtleHeading = N300;
export const codeBlock = N20;
export const link = B400;
export const linkHover = B300;
export const linkActive = B500;
export const linkOutline = B100;
export const primary = G400;
export const blue = B400;
export const teal = T300;
export const purple = P300;
export const red = R300;
export const yellow = Y300;
export const green = G300;