const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const url = new URL(location);

const param = url.search.split('=');

if (param[0] === '?table') {
  h3.innerHTML = 'Table ' + param[1];
}

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
        <div class="input-group">
          <label>Quantite :</label>
          <input type="number" value="0" min="0" max="${produit.qt_dispo}" />
        </div>
      `;
      return article;
    });
    sectionElement.append(...produitsMap);
  } else {
    return null;
  }
};

produitsTemplate();
