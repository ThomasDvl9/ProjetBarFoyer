export default (param) => {
  const produits = fetch('http://172.19.32.3/~paulhelleu/MiniProjet/index.php/' + param)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => null);
  return produits;
};
