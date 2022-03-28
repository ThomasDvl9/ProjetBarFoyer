const sectionElement = document.querySelector('section');

const fetchCommandes = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const produitsTemplate = async () => {
  const commandesDispo = await fetchCommandes('getPendingOrders');
  if (commandesDispo != null && commandesDispo.cmdEnCours != 0) {
    const commandesMap = commandesDispo.cmdEnCours.map((commande) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <p>ID Commande : ${commande.id_commande}</p>
        <p>ID table : ${commande.id_table}</p>
        <p>Produits :</p>
      `;
      const produits = document.createElement('div');
      commande.produit.map((produit) => {
        produits.innerHTML += `<p>Nom : ${produit.denomination} x${
          produit.quantite
        }</p><input type="checkbox" ${produit.cochee == '0' ? '' : 'checked'} />`;
      });
      article.appendChild(produits);
      return article;
    });
    sectionElement.innerHTML = '';
    sectionElement.append(...commandesMap);

    const inputElement = document.querySelectorAll('input');
    inputElement.forEach((input) => {
      input.addEventListener('change', (e) => {
        console.log('Input change');
      });
    });
  } else {
    return null;
  }
};

setInterval(() => {
  produitsTemplate();
}, 5000);

produitsTemplate();
