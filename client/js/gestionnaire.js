const sectionProduitElement = document.getElementById('produits');
const sectionTableElement = document.getElementById('tables');

const fetchApi = (param) => {
  const produits = fetch('http://localhost:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchApi('getAvailableProducts');
  const tables = await fetchApi('getTables');

  if (
    produitsDispo != null &&
    Number(produitsDispo.produitsDispo) != 0 &&
    tables != null &&
    Number(tables) != 0
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
          <input type="date" name="peremption" maxlength="10" minlength="10" value="${produit.peremption}" />
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

    sectionProduitElement.innerText = '';
    sectionTableElement.innerText = '';

    sectionProduitElement.append(...produitsMap);
    sectionTableElement.append(...tablesMap);

    // Fonction ajouter

    sectionProduitElement.appendChild(ajouterProduitElement());
    sectionTableElement.appendChild(ajouterTableElement());

    // Edition produit

    const validateBtnProduit = document.querySelectorAll('article[produit-id] > a.btn-validate');
    const deleteBtnProduit = document.querySelectorAll('article[produit-id] > a.btn-delete');

    const validateBtnTable = document.querySelectorAll('article[table-id] > a.btn-validate');
    const deleteBtnTable = document.querySelectorAll('article[table-id] > a.btn-delete');

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
        const datePeremption = peremptionInp.value.split('-');
        const dateProduit = new Date(
          datePeremption[0],
          datePeremption[1],
          datePeremption[2],
        ).getTime();
        if (Date.now() < dateProduit) {
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

          // fetch('url', {
          //   method: 'UPDAT',
          //   body: JSON.stringify(body),
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // });
        } else {
          alert('Date de péremption non valide !');
        }
      });
    });

    validateBtnTable.forEach((btn) => {
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
    });

    deleteBtnTable.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        await fetchApi('deleteTable?table=' + e.target.getAttribute('table-id'));

        produitsTemplate();
      });
    });
  } else {
    return null;
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
      </div>`;

    const btn = document.createElement('a');
    btn.className = 'btn btn-validate btn-container';
    btn.innerText = 'Enregistrer';
    addProduitElement.appendChild(btn);

    // ajouter produit
    btn.addEventListener('click', async (e) => {
      // await fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/addProduct', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: JSON.stringify({}),
      // })
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
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
      </div>`;
    const btn = document.createElement('a');
    btn.className = 'btn btn-validate btn-container';
    btn.innerText = 'Enregistrer';
    tableElement.appendChild(btn);

    // ajouter table
    btn.addEventListener('click', async () => {
      await fetch('url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ numero: '', lien: '' }),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });

  tableElement.appendChild(btnAddElement);
  return tableElement;
};

produitsTemplate();
