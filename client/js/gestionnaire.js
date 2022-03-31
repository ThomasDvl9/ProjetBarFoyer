const sectionProduitElement = document.getElementById('produits');
const sectionTableElement = document.getElementById('tables');
// const url = new URL(location);

// if (url.searchParams.get('id')) {
//   console.log(url.searchParams.get('id'));
// }

const fetchApi = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const addElement = (nom) => {
  const element = document.createElement('article');
  element.innerHTML = `<a class="btn btn-primary">${nom}</a>`;
  return element;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchApi('getAvailableProducts');
  const tables = await fetchApi('getTables');

  if (
    produitsDispo != null &&
    Number(produitsDispo.produitsDispo) != 0 &&
    tables != null &&
    Number(tables.tables) != 0
  ) {
    const produitsMap = produitsDispo.map((produit) => {
      const article = document.createElement('article');
      article.setAttribute('produit-id', produit.id_produit);
      const datePeremption = produit.peremption.split('-');
      const dateProduit = new Date(
        datePeremption[0],
        datePeremption[1],
        datePeremption[2],
      ).getTime();
      if (Date.now() > dateProduit) {
        article.className = 'red';
        article.innerHTML = '<h4>Produit périmé</h4>';
      }

      article.innerHTML += `
        <div class="input-group">
          <label>Nom :</label>
          <input type="text" name="denomination" value="${produit.denomination}" />
        </div>
        <div class="input-group">
          <label>Prix :</label>
          <input type="number" min="0.1" step="0.05" name="prix" value="${produit.prix}" />
        </div>
        <div class="input-group">
          <label>Quantite :</label>
          <input type="number" min="0" name="quantite" value="${produit.qt_dispo}" />
        </div>
        <div class="input-group">
          <label>Date de péremption :</label>
          <input type="text" name="peremption" maxlength="10" minlength="10" value="${produit.peremption}" />
        </div>
        <a produit-id="${produit.id_produit}" class="btn btn-validate btn-container">
          Sauvegarder
        </a>
      `;
      return article;
    });

    const tablesMap = tables.tables.map((table) => {
      const article = document.createElement('article');
      article.setAttribute('table-id', table.id_table);
      article.innerHTML = `
        <div class="input-group">
          <h4>Table id: ${table.id_table}</h4>
        </div>
        <div class="input-group">
          <label>Numéro :</label>
          <input type="number" name="numero" value="${table.numero}" />
        </div>
        <div class="input-group">
          <label>Lien QR-code :</label>
          <input type="text" name="qr-code" value="${table.lien_QRcode}" />
        </div>
        <a table-id="${table.id_table}" class="btn btn-validate btn-container">
          Sauvegarder
        </a>
      `;
      return article;
    });

    sectionProduitElement.append(...produitsMap);
    sectionTableElement.append(...tablesMap);

    const addProduitElement = document.createElement('article');
    const btnAddElement = document.createElement('a');
    btnAddElement.classList = 'btn btn-primary btn-container';
    btnAddElement.innerText = 'Ajouter un produit';

    btnAddElement.addEventListener('click', () => {
      addProduitElement.innerHTML = `<div class="input-group">
        <label>Nom :</label>
        <input type="text" name="denomination" value="" />
        </div>
        <div class="input-group">
          <label>Prix :</label>
          <input type="number" min="0.1" step="0.05" name="prix" value="" />
        </div>
        <div class="input-group">
          <label>Quantite :</label>
          <input type="number" name="quantite" value="" />
        </div>
        <div class="input-group">
          <label>Date de péremption :</label>
          <input type="text" name="peremption" maxlength="10" minlength="10" value="" />
        </div>
        <a class="btn btn-validate btn-container">
          Enregistrer
        </a>`;
    });

    addProduitElement.appendChild(btnAddElement);
    sectionProduitElement.appendChild(addProduitElement);

    const validateBtnProduit = document.querySelectorAll('article[produit-id] > a');
    const validateBtnTable = document.querySelectorAll('article[table-id] > a');

    validateBtnProduit.forEach((btn) => {
      const denominationInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="denomination"]`,
      );
      const prixInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="prix"]`,
      );
      const quantiteInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="quantite"]`,
      );
      const peremptionInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="peremption"]`,
      );

      btn.addEventListener('click', (e) => {
        const body = {};
        alert(
          'Id produit : ' +
            e.target.getAttribute('produit-id') +
            '\nDénomination : ' +
            denominationInp.value +
            '\nPrix : ' +
            prixInp.value +
            '\nQuantite : ' +
            quantiteInp.value +
            '\nPeremption : ' +
            peremptionInp.value,
        );
        fetch('url', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    validateBtnTable.forEach((btn) => {
      const numeroInp = document.querySelector(
        `article[table-id="${btn.getAttribute('table-id')}"] input[name="numero"]`,
      );
      const qrCodeInp = document.querySelector(
        `article[table-id="${btn.getAttribute('table-id')}"] input[name="qr-code"]`,
      );

      btn.addEventListener('click', (e) => {
        alert(
          'Id table : ' +
            e.target.getAttribute('table-id') +
            '\nNuméro : ' +
            numeroInp.value +
            '\nQrCode : ' +
            qrCodeInp.value,
        );
      });
    });
  } else {
    return null;
  }
};

produitsTemplate();
