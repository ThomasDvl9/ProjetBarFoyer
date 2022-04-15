// import fetchApi from './fetchApi';

const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const totalElement = document.getElementById('total');
const url = new URL(location);

if (url.searchParams.get('table')) {
  h3.innerHTML = 'Vous êtes à la table ' + url.searchParams.get('table');
}

const fetchApi = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchApi('getAvailableProducts');

  // verif .produitsDispo
  if (produitsDispo != null && Number(produitsDispo.produitsDispo) != 0) {
    const produitsMap = produitsDispo
      .filter((produit) => {
        const datePeremption = produit.peremption.split('-');
        const dateProduit = new Date(
          datePeremption[0],
          datePeremption[1],
          datePeremption[2],
        ).getTime();

        // filtre produit périmer et quantite
        return Date.now() < dateProduit || Number(produit.qt_dispo);
      })
      .map((produit) => {
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
  } else {
    return null;
  }
};

const submitListener = () => {
  const btnSubmit = document.querySelector('a[type="button"]');
  btnSubmit.addEventListener('click', async () => {
    quantiteInp.forEach((inp, index) => {
      // ? % 1
      if (Number(inp.value) > 0 && Number(inp.value) % 1) {
        console.log('Index ' + index + ' : ' + inp.value);
      }
    });
    await fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({}),
    });
  });
};

const totalFeature = () => {
  const prixArticle = document.querySelectorAll('article > div > p > .price');
  // remplacer par produitsDispo prix

  const quantiteInp = document.querySelectorAll('input[name="quantite"]');

  quantiteInp.forEach((inp) => {
    inp.addEventListener('change', () => {
      let sum = 0;
      quantiteInp.forEach((inp, index) => {
        // sum += Number(inp.value) * Number(produitsDispo[index].prix);

        sum += Number(inp.value) * Number(prixArticle[index].innerText);
      });
      if (sum < 0) {
        alert('Valeur non valide !');
      } else {
        totalElement.innerText = Math.round(sum * 100) / 100;
      }
    });
  });
};

produitsTemplate();
submitListener();
totalFeature();
