document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInp = document.querySelector('input[type="email"]');
  const passwordInp = document.querySelector('input[type="password"]');

  console.log({
    email: emailInp.value,
    password: passwordInp.value,
  });
});
