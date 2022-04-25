document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const idInp = document.querySelector('input[name="identifiant"]');
  const passwordInp = document.querySelector('input[type="password"]');

  console.log({ email: idInp.value, password: passwordInp.value });

  // const body = JSON.stringify({ email: emailInp.value, password: passwordInp.value });

  // fetch('url', {
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
});
