/**
 * 1-bit whale mask generated from docs/assets/deepseek.png.
 * Do not edit by hand — run `pnpm raster-logo`.
 *
 * Crop x=153..1154 y=165..949, nearest-neighbor to 240×188.
 * Bits are row-major, MSB first, each row padded to a whole byte.
 */
export const LOGO_WIDTH = 240;
export const LOGO_HEIGHT = 188;
/** 240 / 188 — used to size the mosaic against a 1:2 cell. */
export const LOGO_ASPECT = 240 / 188;
export const LOGO_BITS = Uint8Array.from(atob(`
  AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  AAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAA
  AAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  AAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAAAAf
  AAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAAAAfAAAAAAAAAAAAAAAAADH/wAAAAAAA/+AAAAAAAAAfAAAAAAAAAAAAAAAAAP//
  wAAAAAAA//wAAAAAAAD/AAAAAAAAAAAAAAAAAP//wAAAAAAA//wAAAAAAAD/AAAAAAAAAAAAAAAAAP//wAAAAAAA//wAAAAAAAD/
  AAAAAAAAH/////8A/////wAAAAAA///gAAAAAAf/AAAAAAAAH/////+A/////wAAAAAA///gAAAAAAf/AAAAAAAAH/////+A////
  /wAAAAAA///gAAAAAAf/AAAAAAAAH/////+A////wAAAAAAA////wAAAAAf/AAAAAAB/////////////wAAAAAAA////wAAAAf//
  AAAAAAB/////////////wAAAAAAA////wAAAAf//AAAAAAB/////////////wAAAAAAA////wAAAAf//AAAAAAB////////////8
  AAAAAAAA////wAAAAf//AAAAAB/////////////8AAAAAAAA////+AAD////AAAAAB/////////////8AAAAAAAA////+AAD////
  AAAAAB/////////////8AAAAAAAA////+AAD////AAAAAf/////////////8AAAAAAAA/////wAf////AAAAAf/////////////8
  AAAAAAAA/////wAf////AAAAAf/////////////8AAAAAAAA/////wAf////AAAAAf//////////////gAAAAAAA/////+H/////
  AAAAAf//////////////gAAAAAAAH////+H/////AAAAH///////////////gAAAAAAAH////+H/////AAAAP///////////////
  +AAAAAAAH///////////AAAAP///////////////+AAAAAAAH///////////AAAAP///////////////+AAAAAAAH//////////w
  AAAAP///////////////+AAAAAAAH//////////wAAAB/////////////////wAAAAAAH//////////wAAAB////////////////
  /wAAAAAAH//////////wAAAB/////////////////wAAAAAAH//////////wAAAf//////////////////gAAAAAAf/////////w
  AAAf//////////////////gAAAAAAf/////////wAAAf//////////////////gAAAAAAf/////////wAAD/////////////////
  //8AAAAAAf////////8AAAD///////////////////8AAAAAAf////////8AAAD///////////////////8AAAAAAf////////8A
  AAD///////////////////8AAAAAAf////////8AAAD///////////////////8AAAAAAP////////8AAAD/////////////////
  ///gAAAAAB////////gAAAD////////////////////gAAAAAB////////gAAAD////////////////////gAAAAAB////////gA
  AA/////////////////////+AAAAAAH//////8AAAA/////////////////////+AAAAAAH//////8AAAA//////////////////
  ///+AAAAAAH//////8AAAA//////////////////////4AAAAAAf////+AAAAA//////////////////////4AAAAAAf////+AAA
  AA//////////////////////4AAAAAAf////+AAAAA//////////////////////4AAAAAAf////+AAAAA//////////////////
  /////gAAAAAB///8AAAAAA///////////////////////gAAAAAB///8AAAAAA///////////////////////gAAAAAB///8AAAA
  AH///////////////////////8AAAAAB///gAAAAAH///////////////////////8AAAAAB///gAAAAAH//////////////////
  /////8AAAAAB///gAAAAAH////////////////////////wAAAAB///gAAAAAH////////////////////////wAAAAB///gAAAA
  AH////////////////////////wAAAAB///gAAAAAH//4AAA///////////////////wAAAf///gAAAAAH//4AAA////////////
  ///////wAAAf///gAAAAAH//4AAA///////////////////wAAAf///gAAAAAH//4AAA///////////////////wAAAf///gAAAA
  AH/+AAAAAD//////////wAH/////AAAf///gAAAAAH/+AAAAAD//////////wAH/////AAAf///gAAAAAH/+AAAAAD//////////
  wAH/////AAAf///gAAAAB//+AAAAAAAf////////wAAf/////gD////gAAAAB//+AAAAAAAf////////wAAf/////gD////gAAAA
  B//+AAAAAAAf////////wAAf/////gD////gAAAAB//+AAAAAAAf////////wAAf/////gD////gAAAAB//+AAAAAAAAH///////
  //AB///////////gAAAAB//+AAAAAAAAH/////////AB///////////gAAAAB//+AAAAAAAAH/////////AB///////////gAAAA
  B//+AAAAAAAAAf////////8B///////////gAAAAB//+AAAAAAAAAf////////8AH/////////4AAAAAB//+AAAAAAAAAf//////
  //8AH/////////4AAAAAB//+AAAAAAAAAf//////+H8AH/////////4AAAAAB//+AAAAAAAAAAD/////+H8AH/////////4AAAAA
  B//+AAAAAAAAAAD/////+H8AAf////////4AAAAAB//+AAAAAAAAAAD/////+H8AAf////////4AAAAAB//+AAAAAAAAAAD/////
  +H8AAf////////4AAAAAB//+AAAAAAAAAAAf////+H8AAf////////4AAAAAB///4AAAAAAAAAAP//////8AAf////////4AAAAA
  B///4AAAAAAAAAAP//////8AAf////////4AAAAAB///4AAAAAAAAAAB//////8AAD////////4AAAAAB///4AAAAAAAAAAB////
  //8AAD////////4AAAAAB///4AAAAAAAAAAB//////8AAD////////4AAAAAB///4AAAAAAAAAAB//////8AAD////////AAAAAA
  B///4AAAAAAAAAAAH//////gAD///////+AAAAAAB///4AAAAAAAAAAAH//////gAD///////+AAAAAAB///4AAAAAAAAAAAH///
  ///gAD///////+AAAAAAB///4AAAAAAAAAAAB///////gD///////+AAAAAAAH//4AAAAAAAAAAAB///////gD///////+AAAAAA
  AH//4AAAAAAAAAAAB///////gD///////+AAAAAAAH//4AAAAAAAAAAAB////////////////+AAAAAAAH///AAAAAAAAAAAAP//
  /////////////+AAAAAAAH///AAAAAAAAAAAAP///////////////+AAAAAAAH///AAAAAAAAAAAAP///////////////+AAAAAA
  AH///AAAAAAAAAAAAB///////////////wAAAAAAAH///AAAAAAAAAAAAB///////////////wAAAAAAAH///AAAAAAAAAAAAB//
  /////////////wAAAAAAAH///AAAAAAAAAAAAAH//////////////wAAAAAAAH///AAAAAAAAAAAAAH//////////////wAAAAAA
  AH///AAAAAAAAAAAAAH//////////////wAAAAAAAA///4AAAAAAAAAAAAH//////////////wAAAAAAAA///4AAAAAAAAAAAAH/
  /////////////wAAAAAAAA///4AAAAAAAAAAAAH/////////////+AAAAAAAAA///4AAAAAAAAAAAAH/////////////+AAAAAAA
  AA///+AAAAAAAAAAAAA/////////////+AAAAAAAAA///+AAAAAAAAAAAAA/////////////+AAAAAAAAA///+AAAAAAAAAAAAA/
  ////////////+AAAAAAAAA///+AAAAAAAAAAAAA/////////////8AAAAAAAAA///+AAAAAAAAAAAAA/////////////8AAAAAAA
  AA///+AAAAAAAAAAAAA/////////////8AAAAAAAAA////AAAAAAAAAAAAAD////////////8AAAAAAAAAD///4AAAAAAAAAAAAD
  ////////////gAAAAAAAAAD///4AAAAAAAAAAAAD////////////gAAAAAAAAAD///4AAAAAAAAAAAAD////////////gAAAAAAA
  AAD////AAAAAAAAAAAAAf//////////4AAAAAAAAAAD////AAAAAAAAAAAAAf//////////4AAAAAAAAAAD////AAAAAAAAAAAAA
  f//////////4AAAAAAAAAAD////AAAAAAAAAAAAAf//////////4AAAAAAAAAAAf///4AAAAAD/wAAAAB//////////gAAAAAAAA
  AAAf///4AAAAAD/wAAAAB//////////gAAAAAAAAAAAf///4AAAAAD/wAAAAB//////////gAAAAAAAAAAAf////AAAAAD//AAAA
  B/////////4AAAAAAAAAAAAf////AAAAAD//AAAAB/////////4AAAAAAAAAAAAB////AAAAAD//AAAAAH////////4AAAAAAAAA
  AAAB////oAAAAD//AAAAAH////////4AAAAAAAAAAAAB////8AAAAD///AAAAH///////+AAAAAAAAAAAAAB////8AAAAD///AAA
  AH///////+AAAAAAAAAAAAAB/////gAAAAf//4AAAAf//////+AAAAAAAAAAAAAB/////gAAAAf//4AAAAf//////+AAAAAAAAAA
  AAAB/////gAAAAf//4AAAAf//////+AAAAAAAAAAAAAAH/////gAAAf///AAAAD//////AAAAAAAAAAAAAAAH/////gAAAf///AA
  AAD//////AAAAAAAAAAAAAAAH/////gAAAf///AAAAD//////AAAAAAAAAAAAAAAH/////gAAAf///AAAAD//////AAAAAAAAAAA
  AAAAAf/////gAAD////AAAAf//////4AAAAAAAAAAAAAAf/////gAAD////AAAAf//////4AAAAAAAAAAAAAAf/////gAAD////A
  AAAf//////4AAAAAAAAAAAAAAf//////4AD////+AAAf///////4AAAAAAAAAAAAAB//////4AD////+AAAB///////4AAAAAAAA
  AAAAAB//////4AD////+AAAB///////4AAAAAAAAAAAAAB//////4AD////+AAAB///////4AAAAAAAAAAAAAAP/////////////
  /AAAH////////AAAAAAAAAAAAAP//////////////AAAH////////AAAAAAAAAAAAAP//////////////AAAH////////AAAAAAA
  AAAAAAB///////////////wAAf///////AAAAAAAAAAAAAB///////////////wAAf///////AAAAAAAAAAAAAB/////////////
  //wAAD///////AAAAAAAAAAAAAB///////////////wAAD///////AAAAAAAAAAAAAAA////////////////+AB////wAAAAAAAA
  AAAAAAAA////////////////+AB////wAAAAAAAAAAAAAAAA////////////////+AB////wAAAAAAAAAAAAAAAA////////////
  ////+AB////wAAAAAAAAAAAAAAAAB///////////////gAAAAAAAAAAAAAAAAAAAAAAAB///////////////gAAAAAAAAAAAAAAA
  AAAAAAAAB///////////////gAAAAAAAAAAAAAAAAAP//AAAAA/////////////gAAAAAAAAAH/4AAAAAAP//AAAAA//////////
  ///gAAAAAAAAAH/4AAAAAAP//AAAAA/////////////gAAAAAAAAAH/4AAAAAAP//AAAAA/////////////gAAAAAAAAAH/4AAAA
  AAAAAAAAAAAf//////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//////////AAAAAAAAAAAAAAAAAAf/8AAAAAAAAf////////
  //AAAAAAAAAAAAB//wAAf/8AAAAAAAAAB///////gAAAD///////gAB//wAAf/8AAAAAAAAAB///////gAAAD///////gAB//wAA
  f/8AAAAAAAAAB///////gAAAD///////gAB//wAAAAAAAAAAAAAAB///////gAAAD///////gAB//wAAAAAAAf///gAAAAAAAAAA
  AAAAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf4Af///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  AAf4Af///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf4AAAAAAAAAAAAAAAA
  AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////AAAAAAAAAAAAAAH//////////gAf///wAAA/////AAAAA
  AAAAAAAAAH//////////gAf///wAAA/////AAAAAAAAAAAAAAH//////////gAf///wAAAAAAAAAAAAAAAAAAAAAAH//////////
  gAf///wAAAAAAAAAAAAA
`.replace(/\s+/g, '')), ch => ch.charCodeAt(0));
