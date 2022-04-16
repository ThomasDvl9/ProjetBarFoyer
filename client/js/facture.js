const url = new URL(location);
let cmdid = 0;

if (!url.searchParams.get('cmdid')) {
  location.replace('http://localhost:5500/client/pages/');
} else {
  cmdid = Number(url.searchParams.get('cmdid'));
  console.log(cmdid);
}

console.log(url);
