const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.log('users', users);
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  console.log('user', user);

  if (!user) {
    Swal.fire({
      icon: 'error',
      text: 'Tus credenciales son incorrectas!',
    });

    return;
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  loginForm.reset();
  location.href = 'catalogoProductos.html';
});
