const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.querySelector('#nombre').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find((user) => user.email === email);
  if (user) {
    Swal.fire({
      icon: 'error',
      text: 'El usuario con ese correo ya esta regsitrado!',
    });
    return;
  }
  const id = users.length + 1;
  users.push({ id, nombre, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  Swal.fire('El usuario fue registrado exitosamente !').then(() => {
    signupForm.reset();
    location.href = 'login.html';
  });
});
