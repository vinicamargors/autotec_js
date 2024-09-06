const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '34.95.168.82',  // Endereço IP público da instância
  user: 'admin',          // Usuário do banco de dados
  password: 're387103',      // Senha do banco de dados
  database: 'dbautotec'  // Nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

module.exports = connection;
