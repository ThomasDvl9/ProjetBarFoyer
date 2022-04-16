// import fetchApi from './fetchApi.js';

const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const totalElement = document.getElementById('total');
const url = new URL(location);
let id_table = null;

if (url.searchParams.get('table')) {
  tableid = Number(url.searchParams.get('table'));
  h3.innerHTML = 'Vous êtes à la table ' + url.searchParams.get('table');
}

const fetchApi = (param) => {
  const produits = fetch('http://localhost:8080/apifoyer/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

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
    quantiteInp.forEach((inp, index) => {
      if (Number(inp.value) > 0 && Number(inp.value) > 1) {
        console.log('Index ' + index + ' : ' + inp.value);
      }
    });

    const email = document.querySelector('input[type="email"]').value;
    const emailReg = /([a-z]@*.*)/g;

    if (id_table != null && emailReg.test(email)) {
      const obj = {
        id_table,
        email,
        confirmee: 1,
        preparee: 0,
        dateCmd: new Date().toJSON().split('T').join(' ').split('.')[0],
      };

      await fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(obj),
      });
    }
  });
};

produitsTemplate();
