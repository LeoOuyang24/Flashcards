export async function getCards(link, start, cardAmount)
{
  return fetch(link).then(res => 
  res.json()).catch(err => console.log(err)).then(json => 
  {
  let temp =json.slice(start - 1,start - 1 + cardAmount);
  return temp
})
}