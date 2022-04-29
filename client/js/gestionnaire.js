const sectionProduitElement = document.getElementById('produits');
const sectionTableElement = document.getElementById('tables');

const fetchApi = (param) => {
  return fetch('http://192.168.1.55:8080/apifoyer/' + param);
};

const fetchApiJson = (param) => {
  const content = fetch('http://192.168.1.55:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
};

const fetchApiPost = (param, body) => {
  const content = fetch('http://192.168.1.55:8080/apifoyer/' + param, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
};

const isPerimer = (date) => {
  const datePeremption = date.split('-');

  const dateProduit = new Date(
    datePeremption[0],
    Number(datePeremption[1]) - 1,
    datePeremption[2],
  ).getTime();

  return dateProduit < Date.now();
};

const modal = ({ message, state, method, id = null, datas = null }, fetchReq, cb) => {
  const deleteElement = () => {
    modalElement.remove();
    document.body.classList.remove('rel');
  };

  const modalElement = document.createElement('div');
  modalElement.classList = 'modal ' + state;
  document.body.classList.add('rel');

  const settingElement = document.createElement('div');
  settingElement.className = 'setting';
  settingElement.innerHTML = `<h3>${message}</h3>`;

  const btnCancel = document.createElement('a');
  btnCancel.classList = 'btn btn-container btn-validate';
  btnCancel.innerHTML = 'Annuler';

  btnCancel.addEventListener('click', (e) => {
    deleteElement();
  });

  const btnConfirm = document.createElement('a');
  btnConfirm.classList = 'btn btn-container btn-delete';
  btnConfirm.innerText = 'Confirmer';

  btnConfirm.addEventListener('click', async (e) => {
    if (datas != null) {
      await fetchReq(method, datas)
        .then((res) => {
          if (res.status == 200) {
            cb();
          } else {
            throw 'error db';
          }
        })
        .catch((err) => console.error(err));
    } else if (id != 0) {
      await fetchReq(method + id)
        .then((res) => res.json())
        .then((json) => {
          if (json === 'already in command') {
            alert('Cette element appartient à une commande');
            throw 'error';
          }
        })
        .then((c) => cb())
        .catch((err) => console.error(err));
    }
    deleteElement();
  });

  settingElement.append(btnCancel, btnConfirm);
  modalElement.appendChild(settingElement);

  modalElement.addEventListener('click', (e) => {
    if (e.target.classList[0] == 'modal') {
      deleteElement(e);
    }
  });

  document.body.appendChild(modalElement);
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchApiJson('getAvailableProducts');

  if (produitsDispo === null && Number(produitsDispo.produitsDispo) === 0) {
    return null;
  }

  const produitsMap = produitsDispo.map((produit) => {
    const article = document.createElement('article');
    article.setAttribute('produit-id', produit.id_produit);

    if (isPerimer(produit.peremption)) {
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
    btn.addEventListener('click', async (e) => {
      const denominationInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="denomination"]`,
      ).value;
      const prixInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="prix"]`,
      ).value;
      const quantiteInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="quantite"]`,
      ).value;
      const peremptionInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="peremption"]`,
      ).value;
      const illustrationInp = document.querySelector(
        `article[produit-id="${btn.getAttribute('produit-id')}"] input[name="illustration"]`,
      ).value;

      if (!isPerimer(peremptionInp)) {
        modal(
          {
            message: 'Modification de : ' + produitsDispo[index].denomination,
            state: '',
            method: 'updateProduct',
            datas: {
              id: e.target.getAttribute('produit-id'),
              nom: denominationInp,
              prix: prixInp,
              quantite: quantiteInp,
              peremption: peremptionInp,
              illustration: illustrationInp,
            },
          },
          fetchApiPost,
          produitsTemplate,
        );
        /*  await fetchApiPost('updateProduct', {
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
          .catch((err) => console.error(err)); */
      } else {
        alert('Date de péremption non valide !');
      }
    });

    deleteBtnProduit[index].addEventListener('click', async (e) => {
      const id = e.target.getAttribute('produit-id');
      modal(
        {
          message: 'Suppression du produit : ' + produitsDispo[index].denomination,
          state: 'red',
          method: 'deleteProduct?product=',
          id,
        },
        fetchApi,
        produitsTemplate,
      );
      /* await fetchApi('deleteProduct' + '?product=' + id)
        .then((res) => res.json())
        .then((json) => {
          if (json === 'already in command') {
            alert('Ce produit appartient à une commande');
          } else {
            throw 'send';
          }
        })
        .catch((err) => produitsTemplate()); */
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

    () => {
      return '3f8b5ae5a72bddc41ee71186057aca5957ee9fb35c0f6ff9d4008aef78ed5125';
    };

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
        modal(
          {
            message: 'Modification de la table numero : ' + tables[index].numero,
            state: '',
            method: 'updateTable',
            datas: {
              id: e.target.getAttribute('table-id'),
              num: numeroInp.value,
              lien: qrCodeInp.value,
            },
          },
          fetchApiPost,
          tablesTemplate,
        );
      });

      deleteBtnTable[index].addEventListener('click', async (e) => {
        const id = e.target.getAttribute('table-id');
        modal(
          {
            message: 'Suppression de la table numero : ' + tables[index].numero,
            state: 'red',
            method: 'deleteTable?table=',
            id,
          },
          fetchApi,
          tablesTemplate,
        );
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

      const datePeremption = peremption.split('-');

      const dateProduit = new Date(
        datePeremption[0],
        Number(datePeremption[1]) - 1,
        datePeremption[2],
      ).getTime();

      if (
        nom != '' &&
        prix != '' &&
        quantite != '' &&
        peremption.length === 10 &&
        dateProduit > Date.now()
      ) {
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
      } else {
        alert('Valeurs non valides !');
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

      if (num != '' && lien != '') {
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
      } else {
        alert('Valeurs non valides !');
      }
    });
  });

  tableElement.appendChild(btnAddElement);
  return tableElement;
};

produitsTemplate();
tablesTemplate();
