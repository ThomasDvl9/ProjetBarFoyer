let cmdid = null;

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

  fetchApiPost('checkValidationToken', { token });
};

checkValidationToken();
