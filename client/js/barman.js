const sectionElement = document.querySelector('section');

const fetchCommandes = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const commandesTemplate = async () => {
  const commandesDispo = await fetchCommandes('getPendingOrders');
  let detailsCommande = [];
  let getProducts = [];

  commandesDispo.map(async (commande) => {
    detailsCommande = await fetchCommandes('getCommandDetailById?id=' + commande.id_commande);

    detailsCommande.map(async (detailsCmd) => {
      getProducts = await fetchCommandes('getProductById?id=' + detailsCmd.id_produit);
      console.log(getProducts);
    });
  });

  if (commandesDispo != null && commandesDispo != 0) {
    const commandesMap = commandesDispo.map((commande) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <p>ID Commande : ${commande.id_commande}</p>
        <p>ID table : ${commande.id_table}</p>
        <p>Produits :</p>
      `;

      const productDivElement = document.createElement('div');
      console.log({ commandesDispo, detailsCommande, getProducts });

      article.appendChild(productDivElement);

      return article;
    });
    // const commandesMap = commandesDispo.cmdEnCours.map((commande) => {
    //   const article = document.createElement('article');
    //   article.innerHTML = `
    //     <p>ID Commande : ${commande.id_commande}</p>
    //     <p>ID table : ${commande.id_table}</p>
    //     <p>Produits :</p>
    //   `;
    //   const produits = document.createElement('div');
    //   commande.produit.map((produit) => {
    //     produits.innerHTML += `<p>Nom : ${produit.denomination} x${
    //       produit.quantite
    //     }</p><input type="checkbox" ${produit.confirmee == '0' ? '' : 'checked'} />`;
    //   });
    //   article.appendChild(produits);

    //   return article;
    // });
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
