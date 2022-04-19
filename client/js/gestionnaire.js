const sectionProduitElement = document.getElementById('produits');
const sectionTableElement = document.getElementById('tables');

const fetchApiJson = (param) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
};

const fetchApi = (param) => {
  return fetch('http://192.168.1.26:8080/apifoyer/' + param);
};

const fetchApiPost = (param, body) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + param, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchApiJson('getAvailableProducts');

  if (produitsDispo === null && Number(produitsDispo.produitsDispo) === 0) {
    return null;
  }

  const produitsMap = produitsDispo.map((produit) => {
    const article = document.createElement('article');
    article.setAttribute('produit-id', produit.id_produit);

    const datePeremption = produit.peremption.split('-');
    const dateProduit = new Date(datePeremption[0], datePeremption[1], datePeremption[2]).getTime();
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
          <input type="date" name="peremption" maxlength="10" minlength="10" value="${produit.peremption}" />
        </div>
        <div class="input-group">
          <label>Source de l'image :</label>
          <input type="text" name="illustration" value="${produit.illustration}" />
        </div>
        <a produit-id="${produit.id_produit}" class="btn btn-validate btn-container">
          Sauvegarder
        </a>
        <a produit-id="${produit.id_produit}" class="btn btn-delete btn-container mt-2">
          Supprimer
        </a>
      `;
    return article;
  });

  sectionProduitElement.innerText = '';

  sectionProduitElement.append(...produitsMap);

  // Fonction ajouter

  sectionProduitElement.appendChild(ajouterProduitElement());

  // Edition produit

  const validateBtnProduit = document.querySelectorAll('article[produit-id] > a.btn-validate');
  const deleteBtnProduit = document.querySelectorAll('article[produit-id] > a.btn-delete');

  validateBtnProduit.forEach((btn, index) => {
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
    const illustrationInp = document.querySelector(
      `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="illustration"]`,
    );

    btn.addEventListener('click', async (e) => {
      const datePeremption = peremptionInp.value.split('-');
      const dateProduit = new Date(
        datePeremption[0],
        datePeremption[1],
        datePeremption[2],
      ).getTime();
      if (Date.now() < dateProduit) {
        await fetchApiPost('updateProduct', {
          id: e.target.getAttribute('produit-id'),
          nom: denominationInp.value,
          prix: prixInp.value,
          quantite: quantiteInp.value,
          peremption: peremptionInp.value,
          illustration: illustrationInp.value,
        })
          .then((res) => {
            res.status;
          })
          .then(() => {
            produitsTemplate();
          })
          .catch((err) => console.error(err));
      } else {
        alert('Date de péremption non valide !');
      }
    });

    deleteBtnProduit[index].addEventListener('click', async (e) => {
      const id = e.target.getAttribute('produit-id');
      await fetchApi('deleteProduct' + '?product=' + id)
        .then((res) => res.json())
        .then((json) => {
          if (json === 'already in command') {
            alert('Ce produit appartient à une commande');
          } else {
            throw 'send';
          }
        })
        .catch((err) => produitsTemplate());
    });
  });
};

const tablesTemplate = async () => {
  const tables = await fetchApiJson('getTables');

  if (tables != null && Number(tables) != 0) {
    const tablesMap = tables.map((table) => {
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
        <a table-id="${table.id_table}" class="btn btn-delete btn-container mt-2">
          Supprimer
        </a>
      `;
      return article;
    });

    sectionTableElement.innerText = '';

    sectionTableElement.append(...tablesMap);

    // Fonction ajouter

    sectionTableElement.appendChild(ajouterTableElement());

    // Edition table

    const validateBtnTable = document.querySelectorAll('article[table-id] > a.btn-validate');
    const deleteBtnTable = document.querySelectorAll('article[table-id] > a.btn-delete');

    validateBtnTable.forEach((btn, index) => {
      const numeroInp = document.querySelector(
        `article[table-id="${btn.getAttribute('table-id')}"] input[name="numero"]`,
      );
      const qrCodeInp = document.querySelector(
        `article[table-id="${btn.getAttribute('table-id')}"] input[name="qr-code"]`,
      );

      btn.addEventListener('click', async (e) => {
        alert(
          'Id table : ' +
            e.target.getAttribute('table-id') +
            '\nNuméro : ' +
            numeroInp.value +
            '\nQrCode : ' +
            qrCodeInp.value,
        );
      });

      deleteBtnTable[index].addEventListener('click', async (e) => {
        const id = e.target.getAttribute('table-id');
        await fetchApi('deleteTable?table=' + id)
          .then((res) => res.json())
          .then((json) => {
            if (json === 'already in command') {
              alert('Cette table appartient à une commande');
            } else {
              throw 'send';
            }
          })
          .catch((err) => tablesTemplate());
      });
    });
  }
};

const ajouterProduitElement = () => {
  const addProduitElement = document.createElement('article');
  const btnAddElement = document.createElement('a');
  btnAddElement.classList = 'btn btn-primary btn-container';
  btnAddElement.innerText = 'Ajouter un produit';

  btnAddElement.addEventListener('click', () => {
    addProduitElement.innerHTML = `
      <div class="input-group">
        <label>Nom :</label>
        <input type="text" name="denomination" value="" />
      </div>
      <div class="input-group">
        <label>Prix :</label>
        <input type="number" min="0.1" step="0.05" name="prix" />
      </div>
      <div class="input-group">
        <label>Quantite :</label>
        <input type="number" name="quantite" value="" />
      </div>
      <div class="input-group">
        <label>Date de péremption :</label>
        <input type="date" name="peremption" maxlength="10" minlength="10" />
      </div>
      <div class="input-group">
        <label>Source de l'image :</label>
        <input type="text" name="illustration" value="null" maxlength="15" />
      </div>
      <a class="btn btn-validate btn-container">
        Enregistrer
      </a>`;

    const btn = addProduitElement.querySelector('a.btn');

    btn.addEventListener('click', async (e) => {
      const nom = addProduitElement.querySelector('input[name="denomination"]').value;
      const prix = addProduitElement.querySelector('input[name="prix"]').value;
      const quantite = addProduitElement.querySelector('input[name="quantite"]').value;
      const peremption = addProduitElement.querySelector('input[name="peremption"]').value;
      const illustration = addProduitElement.querySelector('input[name="illustration"]').value;

      if (nom != '' && prix != '' && quantite != '' && peremption != '') {
        await fetchApiPost('addProduct', {
          nom,
          prix,
          quantite,
          peremption,
          illustration,
        })
          .then((res) => {
            if (res.status == 200) {
              produitsTemplate();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  });

  addProduitElement.appendChild(btnAddElement);
  return addProduitElement;
};

const ajouterTableElement = () => {
  const tableElement = document.createElement('article');
  const btnAddElement = document.createElement('a');
  btnAddElement.classList = 'btn btn-primary btn-container';
  btnAddElement.innerText = 'Ajouter une table';

  btnAddElement.addEventListener('click', () => {
    tableElement.innerHTML = `
      <div class="input-group">
        <label>Numéro :</label>
        <input type="number" name="numero" />
      </div>
      <div class="input-group">
        <label>Lien QR-code :</label>
        <input type="text" name="qr-code" />
      </div>
      <a class="btn btn-validate btn-container">
        Enregistrer
      </a>`;

    const btn = tableElement.querySelector('a.btn');

    // ajouter table
    btn.addEventListener('click', async () => {
      const num = tableElement.querySelector('input[name="numero"]').value;
      const lien = tableElement.querySelector('input[name="qr-code"]').value;

      if (num && lien) {
        await fetchApiPost('addTable', {
          num,
          lien,
        })
          .then((res) => {
            if (res.status == 200) {
              tablesTemplate();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  });

  tableElement.appendChild(btnAddElement);
  return tableElement;
};

produitsTemplate();
tablesTemplate();
