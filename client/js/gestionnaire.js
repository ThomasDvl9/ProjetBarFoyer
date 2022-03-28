const sectionProduitElement = document.getElementById('produits');
const sectionTableElement = document.getElementById('tables');
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

const fetchTables = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const addElement = (nom) => {
  const element = document.createElement('article');
  element.innerHTML = '<a class="btn btn-primary"></a>';
  return element;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchProduits('getAvailableProducts');
  const tables = await fetchProduits('getTables');

  if (
    produitsDispo != null &&
    Number(produitsDispo.produitsDispo) != 0 &&
    tables != null &&
    Number(tables.tables) != 0
  ) {
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
        <a id-produit="${produit.id_produit}" class="btn btn-validate btn-container">
          Sauvegarder
        </a>
      `;
      return article;
    });
    const tablesMap = tables.tables.map((table) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <div class="input-group">
          <h4>Table id: ${table.id_table}</h4>
        </div>
        <div class="input-group">
          <label>Numéro :</label>
          <input type="number" value="${table.numero}" />
        </div>
        <div class="input-group">
          <label>Lien QR-code :</label>
          <input type="text" value="${table.lien_QRcode}" />
        </div>
        <a id-table="${table.id_table}" class="btn btn-validate btn-container">
          Sauvegarder
        </a>
      `;
      return article;
    });
    sectionProduitElement.append(...produitsMap);
    sectionTableElement.append(...tablesMap);

    const validateBtnProduit = document.querySelectorAll('a[id-produit]');
    const validateBtnTable = document.querySelectorAll('a[id-table]');

    validateBtnProduit.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        alert('Produit : ' + btn.getAttribute('id-produit'));
      });
    });

    validateBtnTable.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        alert('Table : ' + btn.getAttribute('id-table'));
      });
    });
  } else {
    return null;
  }
};

produitsTemplate();
