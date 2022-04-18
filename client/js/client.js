const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const totalElement = document.getElementById('total');
const statusElement = document.getElementById('status');
const url = new URL(location);
let table = null;

const fetchApiToJson = (method) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + method)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
};

const fetchApiPost = (method, body) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + method, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
};

const checkTableValidation = async () => {
  const numero = Number(url.searchParams.get('table').split('?')[0]);

  // condition si table n'existe pas
  const tab = await fetchApiToJson('getTable?num=' + numero);
  if (!(tab && tab.length)) {
    location.href = 'http://192.168.1.26:5500/client/pages';
  }

  table = tab[0].id_table;

  h3.innerHTML = 'Vous êtes à la table ' + numero;
};

checkTableValidation();

const produitsTemplate = async () => {
  const produitsDispo = await fetchApiToJson('getAvailableProducts');

  if (produitsDispo != null && Number(produitsDispo) != 0) {
    const filtreProduits = produitsDispo.filter((produit) => {
      const datePeremption = produit.peremption.split('-');
      const dateProduit = new Date(
        datePeremption[0],
        datePeremption[1],
        datePeremption[2],
      ).getTime();

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
            <input type="number" name="quantite" value="0" min="0" max="${produit.qt_dispo}" />
          </div>
        </div>
        <div>
          <img src="../img/${
            String(produit.illustration).toLowerCase() === 'null'
              ? 'no-image.png'
              : produit.illustration
          }" alt="icon" />
        </div>`;

      return article;
    });

    sectionElement.innerHTML = '';

    sectionElement.append(...produitsMap);

    totalFeature(filtreProduits);
  } else {
    return null;
  }
};

const totalFeature = (arr) => {
  const quantiteInp = document.querySelectorAll('input[name="quantite"]');

  quantiteInp.forEach((inp) => {
    inp.addEventListener('change', () => {
      let sum = 0;
      quantiteInp.forEach((inp, index) => {
        const { value } = inp;
        if (Number(value) % 1 != 0) {
          alert('Valeur non valide !');
          inp.value = Math.round(Number(inp.value));
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

  const btnSubmit = document.querySelector('a[type="button"]');

  btnSubmit.addEventListener('click', async () => {
    const email = document.querySelector('input[type="email"]').value;
    const emailReg = new RegExp(/[\w+&*-]+(?:\.[\w+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,24}/);

    const obj = {};

    quantiteInp.forEach(({ value }, index) => {
      if (Number(value) > 0 && !(Number(value) % 1) && Number(value) != NaN) {
        obj[arr[index].id_produit] = value;
      }
    });

    statusElement.classList = 'error';

    if (!emailReg.test(email)) {
      statusElement.innerText = 'Email non valide !';
      return 0;
    }

    if (!Object.keys(obj).length) {
      statusElement.innerText = 'Aucun produit commander !';
      return 0;
    }

    await fetchApiPost('addCommandDetails', {
      productList: obj,
      table,
      email,
    })
      .then((res) => {
        if (res.status == 200) {
          statusElement.classList = 'success';
          statusElement.innerText = 'Envoyer avec succès !';
        } else {
          statusElement.innerText = 'Données envoyés non valides !';
        }
      })
      .catch((err) => {
        console.error('err : ', err);
      });
  });
};

produitsTemplate();
