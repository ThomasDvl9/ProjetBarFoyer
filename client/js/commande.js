const commandElement = document.getElementById('command');
const totalElement = document.querySelector('#total > b');

const fetchApiToJson = (method) => {
  const content = fetch('http://192.168.1.26:8080/apifoyer/' + method)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => null);
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

const checkValidationToken = async () => {
  const token = document.cookie.split('cmd-token=')[1];

  if (!token) {
    return 0;
  }

  return await fetchApiPost('checkValidationToken', { token })
    .then((res) => {
      if (res.status == 400) {
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

  detailsCommands.map(async (detailsCommand) => {
    const produit = await fetchApiToJson('getProductById?id=' + detailsCommand.id_produit).then(
      (res) => {
        return res[0];
      },
    );

    if (produit == null) {
      return 0;
    }

    sommeTotal += Number(detailsCommand.qt_commandee) * Number(produit.prix);

    const element = document.createElement('div');
    element.innerHTML = `
      <h3>${produit.denomination} x${detailsCommand.qt_commandee}</h3>
      <p>Soit ${Number(detailsCommand.qt_commandee) * Number(produit.prix)} €</p>
    `;

    commandElement.appendChild(element);

    totalElement.innerText = sommeTotal;
  });
};

displayCommand();
