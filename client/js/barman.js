const sectionElement = document.querySelector('section');

const fetchApi = (param) => {
  const produits = fetch('http://192.168.1.26:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

let refresh = setInterval(() => {
  commandesTemplate();
}, 5000);

document.addEventListener('mousemove', (e) => {
  clearInterval(refresh);
  refresh = setInterval(() => {
    commandesTemplate();
  }, 5000);
});

const commandesTemplate = async () => {
  const commandesDispo = await fetchApi('getPendingOrders');
  const detailsCommande = await fetchApi('getCommandsDetails');
  const products = await fetchApi('getAvailableProducts');

  if (commandesDispo === null && commandesDispo == 0) {
    return 0;
  }

  const commandesMap = commandesDispo.map((commande) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <p>ID Commande : ${commande.id_commande}</p>
      <p>ID table : ${commande.id_table}</p>
      <p>Produits :</p>
    `;

    const productDivElement = document.createElement('div');

    article.appendChild(productDivElement);

    return article;
  });

  sectionElement.innerHTML = '';
  sectionElement.append(...commandesMap);

  const inputElement = document.querySelectorAll('input');
  inputElement.forEach((input) => {
    input.addEventListener('change', () => {
      console.log('Input change');
    });
  });
};

commandesTemplate();
