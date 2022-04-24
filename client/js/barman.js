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
  const commandes = await fetchApiToJson('getAllDetailsCommandForCheckedCommand');

  if (commandes === null) {
    return 0;
  }

  const commandeTemplate = commandes[0].map((commande, index) => {
    const article = document.createElement('article');
    const contactElement = document.createElement('a');

    contactElement.className = 'contact';
    contactElement.href = 'mailto:' + commande.email;
    contactElement.innerHTML = '<i class="fa-regular fa-envelope"></i>';

    const numTable = commandes[1][index];
    article.innerHTML = '<h4>Table ' + numTable + '</h4>';

    const produitsElement = document.createElement('div');
    produitsElement.className = 'products-list';

    commandes[2][index].map((detailsCommande) => {
      const produit = commandes[3].find(({ id_produit }) => {
        return id_produit === detailsCommande.id_produit;
      });

      produitsElement.innerHTML += `<h4>${produit.denomination} x${
        detailsCommande.qt_commandee
      }</h4><input d-cmd="${detailsCommande.id_detail}" type="checkbox" ${
        Number(detailsCommande.cochee) ? 'disabled checked' : ''
      } />`;
    });

    const distribuerElement = document.createElement('a');
    distribuerElement.setAttribute('cmd', commande.id_commande);
    distribuerElement.classList = 'btn btn-validate btn-container';
    distribuerElement.innerText = 'Distribuer';

    article.append(contactElement, produitsElement, distribuerElement);
    return article;
  });

  sectionElement.innerHTML = '';
  sectionElement.append(...commandeTemplate);

  const inputElement = document.querySelectorAll('input');
  inputElement.forEach((input) => {
    input.addEventListener('change', (e) => {
      console.log(e.target.getAttribute('d-cmd'));
    });
  });
};

commandesTemplate();
