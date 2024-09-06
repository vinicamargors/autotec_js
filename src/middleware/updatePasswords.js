const bcrypt = require('bcryptjs');
const db = require('./db'); // Ajuste o caminho conforme necessário

const login = 'admin'; // Login do usuário
const novaSenha = 'admin123'; // Nova senha em texto simples

bcrypt.hash(novaSenha, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Erro ao criptografar a senha:', err);
    return;
  }

  db.query('UPDATE tbusuarios SET senha = ? WHERE login = ?', [hashedPassword, login], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar a senha:', err);
      return;
    }
    console.log('Senha atualizada com sucesso');
  });
});
