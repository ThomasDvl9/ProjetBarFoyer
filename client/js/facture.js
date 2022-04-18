const url = new URL(location);
let cmdid = 0;

const fetchApi = (param) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
};

const checkCmdValidation = async () => {
  cmdid = Number(url.searchParams.get('table').split('?')[0]);

  // condition si table n'existe pas
  const tables = await fetchApi('getTables');
  if (!(cmdid && cmdid <= tables.length)) {
    location.href = 'http://192.168.1.26:5500/client/pages';
  }

  h3.innerHTML = 'Vous êtes à la table ' + id_table;
};

checkCmdValidation();
