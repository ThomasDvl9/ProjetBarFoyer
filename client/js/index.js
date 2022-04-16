const titleElements = document.querySelectorAll('.title');
const contentElements = document.querySelectorAll('.content');
const tablesElement = document.getElementById('tables');

const fetchApi = (param) => {
  const produits = fetch('http://192.168.1.26:8080/apifoyer/' + param)
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
  const elements = [];

  for (let i = 0; i < tables.length; i++) {
    const element = document.createElement('div');
    element.innerHTML = '<i class="fa-solid fa-qrcode"></i> <h4>' + (i + 1) + '</h4>';

    elements.push(element);

    element.addEventListener('click', () => {
      location.href = 'http://192.168.1.26:5500/client/pages/client.html?table=' + (i + 1);
    });
  }

  tablesElement.append(...elements);
};

tablesTemplate();
