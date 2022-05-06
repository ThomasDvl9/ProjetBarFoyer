const commandElement = document.getElementById('command');
const totalElement = document.getElementById('total');
const produitsList = {};

const url = new URL(location);
let cmdId = null;

const fetchApiToJson = (method) => {
  const content = fetch('http://192.168.1.26:8080/foyerbdd/' + method)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => null);
  return content;
};

const fetchApiPost = (method, body) => {
  const content = fetch('http://192.168.1.26:8080/foyerbdd/' + method, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  });
  return content;
};

const checkValidationToken = async () => {
  const token = url.searchParams.get('token');
  console.log(token);
  if (!token) {
    location.href = '/client/pages/';
    return 0;
  }

  return await fetchApiPost('checkValidationTokenCommand', { token })
    .then((res) => {
      if (res.status == 400) {
        location.href = '/client/pages/';
        return 0;
      }
      return res.json();
    })
    .then((json) => json)
    .catch((err) => {
      console.error('err : ', err);
    });
};

const displayCommand = async () => {
  const cmdid = await checkValidationToken();
  if (!cmdid) {
    return 0;
  }

  const commands = await fetchApiToJson('getCommandById?id=' + cmdid);
  if (commands == null) {
    return 0;
  }

  const detailsCommands = await fetchApiToJson('getCommandDetailByCommandId?id=' + cmdid);
  if (detailsCommands == null) {
    return 0;
  }

  let sommeTotal = 0;

  totalElement.innerHTML = 'Pour un total de <b></b> €';
  commandElement.innerHTML = '';

  detailsCommands.map(async (detailsCommand) => {
    if (!produitsList[detailsCommand.id_produit]) {
      const produit = await fetchApiToJson('getProductById?id=' + detailsCommand.id_produit);

      produitsList[detailsCommand.id_produit] = await produit[0];
    }

    if (produitsList[detailsCommand.id_produit] == null) {
      return 0;
    }

    sommeTotal +=
      Number(detailsCommand.qt_commandee) * Number(produitsList[detailsCommand.id_produit].prix);

    const element = document.createElement('div');
    element.innerHTML = `
      <h3>${produitsList[detailsCommand.id_produit].denomination} x${
      detailsCommand.qt_commandee
    }</h3>
      <p>Soit ${Math.round(
        Number(detailsCommand.qt_commandee) * Number(produitsList[detailsCommand.id_produit].prix),
      )} €</p>
    `;

    commandElement.appendChild(element);
    totalElement.querySelector('b').innerText = Math.round(sommeTotal * 100) / 100;
  });
};

displayCommand();
