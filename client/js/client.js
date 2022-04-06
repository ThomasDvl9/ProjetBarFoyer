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

  if (produitsDispo != null && Number(produitsDispo.produitsDispo) != 0) {
    const produitsMap = produitsDispo
      .filter((produit) => {
        const datePeremption = produit.peremption.split('-');
        const dateProduit = new Date(
          datePeremption[0],
          datePeremption[1],
          datePeremption[2],
        ).getTime();

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

    const btnSubmit = document.querySelector('a[type="button"]');
    const prixArticle = document.querySelectorAll('article > div > p > .price');
    const quantiteInp = document.querySelectorAll('input[name="quantite"]');

    btnSubmit.addEventListener('click', async () => {
      quantiteInp.forEach((inp, index) => {
        if (Number(inp.value) > 0 && Number(inp.value) % 1) {
          console.log('Index ' + index + ' : ' + inp.value);
        }
      });
      await fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/addTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ table: 45 }),
      });
    });

    quantiteInp.forEach((inp) => {
      inp.addEventListener('change', () => {
        let sum = 0;
        quantiteInp.forEach((inp, index) => {
          sum += Number(inp.value) * Number(prixArticle[index].innerText);
        });
        if (sum < 0) {
          alert('Valeur non valide !');
        } else {
          totalElement.innerText = Math.round(sum * 100) / 100;
        }
      });
    });
  } else {
    return null;
  }
};

produitsTemplate();
