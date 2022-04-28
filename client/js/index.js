const titleElements = document.querySelectorAll('.title');
const contentElements = document.querySelectorAll('.content');
const tablesElement = document.getElementById('tables');

const fetchApi = (param) => {
  const produits = fetch('http://10.100.1.216:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

titleElements.forEach((element, index) => {
  element.addEventListener('click', (e) => {
    contentElements[index].classList.toggle('hidden');
    element.classList.toggle('active');
  });
});

const tablesTemplate = async () => {
  const tables = await fetchApi('getTables');

  const sortTables = tables.sort((a, b) => Number(a.numero) - Number(b.numero));

  const elements = sortTables.map((table) => {
    const element = document.createElement('div');
    element.innerHTML = '<i class="fa-solid fa-qrcode"></i> <h4>' + table.numero + '</h4>';

    element.addEventListener('click', (e) => {
      location.href = 'http://10.100.1.216:5500/client/pages/client.html?table=' + table.numero;
    });

    return element;
  });

  tablesElement.append(...elements);
};

tablesTemplate();
