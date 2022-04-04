const sectionElement = document.querySelector('section');

const fetchApi = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const commandesTemplate = async () => {
  const commandesDispo = await fetchApi('getPendingOrders');
  const detailsCommande = await fetchApi('getCommandsDetails');
  const products = await fetchApi('getAvailableProducts');

  if (commandesDispo != null && commandesDispo != 0) {
    const commandesMap = commandesDispo.map((commande) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <p>ID Commande : ${commande.id_commande}</p>
        <p>ID table : ${commande.id_table}</p>
        <p>Produits :</p>
      `;

      const productDivElement = document.createElement('div');
      console.log({ commandesDispo, detailsCommande, products });

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
  } else {
    return null;
  }
};

setInterval(() => {
  commandesTemplate();
}, 5000);

commandesTemplate();
