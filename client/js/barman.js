const sectionElement = document.querySelector('section');

const fetchApi = (method) => {
  return fetch('http://192.168.1.55:8080/apifoyer/' + method);
};

const fetchApiToJson = (method) => {
  const produits = fetch('http://192.168.1.55:8080/apifoyer/' + method)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const fetchApiPost = (param, body) => {
  const content = fetch('http://192.168.1.55:8080/apifoyer/' + param, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
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
    let nonCochee = 0;

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
      !Number(detailsCommande.cochee) ? nonCochee++ : null;
    });

    const distribuerElement = document.createElement('a');
    distribuerElement.setAttribute('cmd', commande.id_commande);
    distribuerElement.setAttribute('type', 'button');
    // disabled si tous n'est pas cochee

    distribuerElement.classList = 'btn btn-validate btn-container';
    distribuerElement.innerText = 'Distribuer';

    distribuerElement.addEventListener('click', async (e) => {
      if (nonCochee) {
        alert('Vous devez cochez les produits avant de confirmer la commande !');
      } else {
        const id = e.target.getAttribute('cmd');
        await fetchApiPost('prepareCommand', { id });
        commandesTemplate();
      }
    });

    article.append(contactElement, produitsElement, distribuerElement);
    return article;
  });

  sectionElement.innerHTML = '';
  sectionElement.append(...commandeTemplate);

  const inputElement = document.querySelectorAll('input');
  inputElement.forEach((input) => {
    input.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('d-cmd');
      await fetchApiPost('checkDetailCommand', { id });
      commandesTemplate();
    });
  });
};

commandesTemplate();
