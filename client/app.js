const mainElement = document.querySelector('main');

const fetchProduits = async (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.log(err));
  return produits;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchProduits('getAvailableProducts').produitsDispos;
  if (produitsDispo && produitsDispo.length) {
    const produitsMap = produproduitsDispoits.map((produit) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <p>Id : ${produit.id_produit}</p>
        <p>Nom : ${produit.denomination}</p>
        <p>Prix : ${produit.prix}</p>
        <p>Quantite : ${produit.qt_dispo}</p>
      `;
      return article;
    });
    mainElement.append(...produitsMap);
  } else {
    return null;
  }
};

produitsTemplate();
