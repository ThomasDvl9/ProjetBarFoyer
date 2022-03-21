const sectionElement = document.querySelector('section');

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
        <p>Nom: ${produit.denomination}</p>
        <p>Prix: ${produit.denomination}</p>
        <p>Quantite: ${produit.qt_dispo}</p>
      `;
      article.addEventListener('click', (e) => {});
      return article;
    });
    sectionElement.append(...produitsMap);
  } else {
    return null;
  }
};

produitsTemplate();
