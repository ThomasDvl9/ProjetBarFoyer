const sectionElement = document.querySelector('section');
const h3 = document.querySelector('h3');
const url = new URL(location);

if (url.searchParams.get('table')) {
  h3.innerHTML = 'Vous êtes à la table ' + url.searchParams.get('table');
}

const fetchProduits = (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};

const produitsTemplate = async () => {
  const produitsDispo = await fetchProduits('getAvailableProducts');

  if (produitsDispo != null && Number(produitsDispo.produitsDispo) != 0) {
    const produitsMap = produitsDispo
      .filter((produit) => {
        const datePeremption = produit.peremption.split('-');
        const dateProduit = new Date(
          datePeremption[0],
          datePeremption[1],
          datePeremption[2],
        ).getTime();

        return Date.now() < dateProduit;
      })
      .map((produit) => {
        const article = document.createElement('article');
        if (produit.qt_dispo != 0) {
          article.innerHTML = `
              <p>Nom : ${produit.denomination}</p>
              <p>Prix : ${produit.prix}</p>
              <div class="input-group">
                <label>Quantite :</label>
                <input type="number" name="quantite" value="0" min="0" max="${produit.qt_dispo}" />
              </div>
            `;
          return article;
        }
      });

    sectionElement.append(...produitsMap);

    const btnSubmit = document.querySelector('a[type="button"]');
    const quantiteInp = document.querySelectorAll('input[name="quantite"]');
    btnSubmit.addEventListener('click', () => {
      quantiteInp.forEach((inp, index) => {
        console.log('Index ' + index + ' : ' + inp.value);
      });
    });
  } else {
    return null;
  }
};

produitsTemplate();
