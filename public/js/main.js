document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');
  const logoutButton = document.getElementById('logoutButton');

  // Função para logout
  if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
          try {
              // Faz a requisição de logout
              const response = await fetch('/logout', {
                  method: 'GET',
                  credentials: 'include' // Inclui cookies com a requisição
              });

              if (response.ok) {
                  // Redireciona para a página de login após o logout
                  window.location.href = '/login';
              } else {
                  // Exibe uma mensagem de erro se o logout falhar
                  console.error('Erro ao realizar logout.');
              }
          } catch (error) {
              console.error('Erro ao realizar logout:', error);
          }
      });
  }

  // Função para login
  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault(); // Impede o envio padrão do formulário

          const formData = new FormData(loginForm);
          const data = {
              login: formData.get('login'),
              senha: formData.get('senha')
          };

          console.log('Dados enviados para o login:', data); // Inspeção dos dados

          try {
              const response = await fetch('/api/usuarios/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              });

              const result = await response.json();

              if (response.ok) {
                  // Armazena o token na sessão e redireciona para o dashboard
                  document.cookie = `sessionToken=${result.token}; path=/`;
                  window.location.href = '/dashboard';
              } else {
                  // Exibe a mensagem de erro
                  errorMessage.textContent = result.error || 'Erro ao realizar login';
                  errorMessage.style.display = 'block';
              }
          } catch (error) {
              console.error('Erro:', error);
              errorMessage.textContent = 'Erro ao realizar login';
              errorMessage.style.display = 'block';
          }
      });
  }
});
