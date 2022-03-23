const sectionElement = document.querySelector('section');
// const url = new URL(location);

// if (url.searchParams.get('id')) {
//   console.log(url.searchParams.get('id'));
// }

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
        <div class="input-group">
          <label>Nom :</label>
          <input type="text" value="${produit.denomination}" />
        </div>
        <div class="input-group">
          <label>Prix :</label>
          <input type="number" value="${produit.prix}" />
        </div>
        <div class="input-group">
          <label>Quantite :</label>
          <input type="number" value="${produit.qt_dispo}" />
        </div>
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
