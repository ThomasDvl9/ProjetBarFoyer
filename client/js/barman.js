const sectionElement = document.querySelector('section');
const produitsList = {};
const tablesList = {};

const fetchApi = (param) => {
  return fetch('http://192.168.1.26:8080/apifoyer/' + param);
};

const fetchApiToJson = (param) => {
  const produits = fetch('http://192.168.1.26:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

// let refresh = setInterval(() => {
//   commandesTemplate();
// }, 5000);

// document.addEventListener('mousemove', (e) => {
//   clearInterval(refresh);
//   refresh = setInterval(() => {
//     commandesTemplate();
//   }, 5000);
// });

const commandesTemplate = async () => {
  const commandesDispo = await fetchApiToJson('getPendingOrders');

  if (commandesDispo === null && commandesDispo == 0) {
    return 0;
  }

  await commandesDispo
    .filter((commande) => {
      return Number(commande.confirmee);
    })
    .map(async (commande) => {
      const article = document.createElement('article');
      const contactElement = document.createElement('a');

      if (!tablesList[commande.id_table]) {
        const table = await fetchApiToJson('getTable?num=' + commande.id_table);
        tablesList[commande.id_table] = await table[0].numero;
      }

      contactElement.className = 'contact';
      contactElement.href = 'mailto:' + commande.email;
      contactElement.innerHTML = '<i class="fa-regular fa-envelope"></i>';

      article.innerHTML =
        '<h3>Id ' +
        commande.id_commande +
        '</h3><h3>Table ' +
        tablesList[commande.id_table] +
        '</h3>';

      const commandDetails = await fetchApiToJson(
        'getCommandDetailByCommandId?id=' + commande.id_commande,
      );

      await commandDetails.map(async (commandDetail) => {
        if (!produitsList[commandDetail.id_produit]) {
          const produit = await fetchApiToJson('getProductById?id=' + commandDetail.id_produit);

          produitsList[commandDetail.id_produit] = await produit[0];
        }

        const produitElement = document.createElement('div');

        produitElement.innerHTML =
          '<h3>' +
          produitsList[commandDetail.id_produit].denomination +
          ' x' +
          commandDetail.qt_commandee +
          '</h3>' +
          `<input type="checkbox" ${Number(commandDetail.cochee) ? 'disabled checked' : ''} />`;

        console.log(contactElement);
        console.log(produitElement);

        article.append(contactElement, produitElement);
      });

      sectionElement.appendChild(article);
    });

  sectionElement.innerHTML = '';

  const inputElement = document.querySelectorAll('input');
  inputElement.forEach((input) => {
    input.addEventListener('change', () => {
      console.log('Input change');
    });
  });
};

commandesTemplate();
