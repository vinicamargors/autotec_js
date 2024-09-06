const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization
  const cookieToken = req.cookies.sessionToken; // Obtém o token dos cookies

  // Prioriza o token do cabeçalho, se disponível
  const tokenToVerify = token || cookieToken;

  if (!tokenToVerify) {
    console.log('Token não fornecido');
    return res.redirect('/login'); // Redireciona se não houver token
  }

  jwt.verify(tokenToVerify, 'secreta', (err, user) => {
    if (err) {
      console.log('Erro ao verificar o token:', err);
      return res.redirect('/login'); // Redireciona se o token for inválido
    }

    console.log('Usuário autenticado:', user); // Adicione este log para verificar o usuário
    req.user = user; // Certifique-se de que o role está incluído aqui
    next();
  });
};

module.exports = authenticateToken;
