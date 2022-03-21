const mainElement = document.querySelector('main');

const fetchProduits = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchProduits('getAvailableProducts');
  if (produitsDispo != null && produitsDispo) {
    const produitsMap = produitsDispo.produitsDispos.map((produit) => {
      const article = document.createElement('article');
      article.innerHTML = `
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
