// import fetchApi from './fetchApi.js';

const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const totalElement = document.getElementById('total');
const url = new URL(location);
let id_table = null;

const fetchApi = (param) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return content;
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

const checkTableValidation = async () => {
  id_table = Number(url.searchParams.get('table').split('?')[0]);

  // condition si table n'existe pas
  const tables = await fetchApi('getTables');
  if (!(id_table && id_table <= tables.length)) {
    location.href = 'http://192.168.1.26:5500/client/pages';
  }

  h3.innerHTML = 'Vous êtes à la table ' + id_table;
};

checkTableValidation();

const produitsTemplate = async () => {
  const produitsDispo = await fetchApi('getAvailableProducts');

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
          <img src="../img/${produit.illustration}" alt="icon" />
        </div>`;

      return article;
    });

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
        } else {
          sum += Number(value) * Number(arr[index].prix);
        }
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

    quantiteInp.forEach(async (inp, index) => {
      if (
        Number(inp.value) > 0 &&
        Number(inp.value) % 1 === 0 &&
        id_table != null &&
        emailReg.test(email)
      ) {
        console.log('Index ' + arr[index].id_produit + ' : ' + inp.value);
        await fetchApiPost('addCommandDetails', {
          product: arr[index].id_produit,
          qt: inp.value,
          table: id_table,
          email,
        });
      }
    });
  });
};

produitsTemplate();
