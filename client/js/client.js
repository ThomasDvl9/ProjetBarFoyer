// cookie minutes timer 33/77

const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const totalElement = document.getElementById('total');
const statusElement = document.getElementById('status');
let quantiteInp = null;
const qt = [];

const url = new URL(location);
let table = null;

const fetchApiToJson = (method) => {
  const content = fetch('http://192.168.1.55:8080/apifoyer/' + method)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
};

const fetchApiPost = (method, body) => {
  const content = fetch('http://192.168.1.55:8080/apifoyer/' + method, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
};

const modal = (message) => {
  const deleteElement = () => {
    modalElement.remove();
    document.body.classList.remove('rel');
  };

  const modalElement = document.createElement('div');
  modalElement.classList = 'modal';
  document.body.classList.add('rel');

  const settingElement = document.createElement('div');
  settingElement.className = 'setting';
  settingElement.innerHTML = `<h3>${message}</h3>`;

  const btnCancel = document.createElement('a');
  btnCancel.classList = 'btn btn-container btn-delete';
  btnCancel.innerHTML = 'Annuler';

  btnCancel.addEventListener('click', (e) => {
    deleteElement();
    console.log('Cancel');
  });

  const btnConfirm = document.createElement('a');
  btnConfirm.classList = 'btn btn-container btn-validate';
  btnConfirm.innerText = 'Confirmer';

  btnConfirm.addEventListener('click', async (e) => {
    console.log('Confirm');
    location.href = 'http://192.168.1.55:5500/client/pages/commande.html';
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

const createCookie = async (token) => {
  document.cookie =
    'cmd-token=' + token + '; expires=' + new Date(Date.now() + 1000 * 60 * 15).toGMTString();
};

const checkTableValidation = async () => {
  const numero = Number(url.searchParams.get('table'));

  // condition si table n'existe pas
  const tab = await fetchApiToJson('getTable?num=' + numero);
  if (!(tab && tab.length)) {
    location.href = 'http://192.168.1.55:5500/client/pages';
  }

  table = tab[0].id_table;
  h3.innerHTML = 'Vous êtes à la table ' + numero;
};

checkTableValidation();

const produitsTemplate = async () => {
  const produitsDispo = await fetchApiToJson('getAvailableProducts');

  if (produitsDispo === null && Number(produitsDispo) === 0) {
    return 0;
  }

  const filtreProduits = produitsDispo.filter((produit) => {
    const datePeremption = produit.peremption.split('-');
    const dateProduit = new Date(datePeremption[0], datePeremption[1], datePeremption[2]).getTime();

    // filtre produit périmer et quantite
    return Date.now() < dateProduit && Number(produit.qt_dispo);
  });

  const produitsMap = filtreProduits.map((produit) => {
    const article = document.createElement('article');
    article.classList = 'products';
    article.innerHTML = `
      <div>
        <p>Nom : ${produit.denomination}</p>
        <p>Prix : <span class="price">${produit.prix}</span> €</p>
        <div class="input-group">
          <label>Quantite :</label>
          <input type="number" name="quantite" pattern="\\d*" value="0" min="0" max="${
            produit.qt_dispo
          }" />
        </div>
      </div>
      <div>
        <img src="../img/${
          String(produit.illustration).toLowerCase() === 'null'
            ? 'no-image.png'
            : produit.illustration
        }" alt="icon" />
      </div>`;

    () => {
      return '3f8b5ae5a72bddc41ee71186057aca5957ee9fb35c0f6ff9d4008aef78ed5125';
    };

    qt.push(produit.qt_dispo);

    return article;
  });

  sectionElement.innerHTML = '';

  sectionElement.append(...produitsMap);

  quantiteInp = document.querySelectorAll('input[name="quantite"]');

  totalFeature(filtreProduits);
  verifySubmit(filtreProduits);
};

const totalFeature = (arr) => {
  quantiteInp.forEach((inp) => {
    inp.addEventListener('change', () => {
      let sum = 0;
      quantiteInp.forEach((inp, index) => {
        const { value } = inp;
        if (Number(value) % 1 != 0) {
          alert('Valeur non valide !');
          inp.value = Math.round(Number(inp.value));
        }

        if (value.match(new RegExp(/\d/g)) == null) {
          alert('Valeur non valide !');
          inp.value = 0;
        }

        if (Number(value) > Number(qt[index])) {
          inp.value = qt[index];
        }

        sum += Number(inp.value) * Number(arr[index].prix);
      });

      if (sum < 0) {
        alert('Valeur non valide !');
      } else {
        totalElement.innerText = Math.round(sum * 100) / 100;
      }
    });
  });
};

const verifySubmit = (arr) => {
  const btnSubmit = document.querySelector('a[type="button"]');

  btnSubmit.addEventListener('click', async () => {
    const email = document.querySelector('input[type="email"]').value;
    const emailReg = new RegExp(/[\w+&*-]+(?:\.[\w+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,24}/);

    const obj = {};

    quantiteInp.forEach(({ value }, index) => {
      if (Number(value) === NaN) {
        statusElement.innerText = 'Valeur commander non valide !';
        return 0;
      }

      if (Number(value) > 0 && !(Number(value) % 1)) {
        obj[arr[index].id_produit] = value;
      }
    });

    statusElement.classList = 'error';

    if (!Object.keys(obj).length) {
      statusElement.innerText = 'Aucun produit commandé !';
      return 0;
    }

    if (!emailReg.test(email)) {
      statusElement.innerText = 'Email non valide !';
      return 0;
    }

    await fetchApiPost('addCommandDetails', {
      productList: obj,
      table,
      email,
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        }

        if (res.status == 401) {
          statusElement.innerText =
            "Trop tard quelqu'un viens de commander un produit que vous avez choisi !";
          produitsTemplate();
          throw 'error db';
        }

        if (res.status == 400) {
          statusElement.innerText = 'Données envoyés non valides !';
          produitsTemplate();
          throw 'error db';
        }
      })
      .then((json) => {
        createCookie(json);
        modal('Confirmation de votre commande');

        // propose redirection pour confirmation : commande.html
      })
      .catch((err) => {
        console.error('err : ', err);
      });
  });
};

produitsTemplate();
