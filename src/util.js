export async function getCards(link, start)
{
  return fetch(link).then(res => 
  res.json()).catch(err => console.log(err)).then(json => 
  {
      return json.slice(start-1,json.length)
})
}


//shamelessly stolen from https://stackoverflow.com/a/47593316
//returns a prng, not a random number
export function prng(a) {
 return function() {
   a |= 0;
   a = a + 0x9e3779b9 | 0;
   let t = a ^ a >>> 16;
   t = Math.imul(t, 0x21f0aaad);
   t = t ^ t >>> 15;
   t = Math.imul(t, 0x735a2d97);
   return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}