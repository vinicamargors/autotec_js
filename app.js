const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const clientesRoutes = require('./src/routes/clientesRoutes');
const osRoutes = require('./src/routes/osRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./db');

const PORT = process.env.PORT || 3000;

// Configurar o middleware de cookies
app.use(cookieParser());

// Configurar a pasta pública para arquivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configurar a pasta views para renderizar HTML
app.use(express.static(path.join(__dirname, 'views')));

// Configurar o middleware para interpretar JSON
app.use(express.json()); 

// Rotas de API
app.use('/api/clientes', clientesRoutes);
app.use('/api/os', osRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Roteamento das páginas HTML
/*funcionando 
app.get('/', (req, res) => res.redirect('/login')); // Redireciona para a página de login
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html'))); // Index agora é o login
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views/dashboard.html'))); // Adiciona uma rota para o dashboard
*/
// Roteamento das páginas HTML
app.get('/', (req, res) => res.redirect('/login')); // Redireciona para a página de login
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html'))); // Index agora é o login
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views/dashboard.html'))); // Adiciona uma rota para o dashboard
app.get('/clientes', (req, res) => res.sendFile(path.join(__dirname, 'views/clientes.html'))); // Adiciona uma rota para a página de clientes
app.get('/ordens', (req, res) => res.sendFile(path.join(__dirname, 'views/ordens.html'))); // Adiciona uma rota para a página de ordens de serviço

// Rota de logout
app.get('/logout', (req, res) => {
  res.clearCookie('sessionToken'); // Limpa o cookie de sessão
  res.redirect('/login'); // Redireciona para a página de login
});


// Rota de logout
app.get('/logout', (req, res) => {
  res.clearCookie('sessionToken'); // Limpa o cookie de sessão
  res.redirect('/login'); // Redireciona para a página de login
});

app.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
      // Verificar o token
      jwt.verify(token, 'secreta', (err, decoded) => {
          if (err) {
              return res.status(401).json({ message: 'Token inválido' });
          }
          req.user = decoded;
          next();
      });
  } else {
      res.status(401).json({ message: 'Token não fornecido' });
  }
});


// Exemplo de endpoint para obter uma ordem específica com o nome do cliente
app.get('/api/os/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const query = `
      SELECT * FROM vw_ordens_com_cliente
      WHERE os = ?
  `;

  try {
      const [rows] = await db.query(query, [id]);
      if (rows.length === 0) {
          return res.status(404).json({ error: 'Ordem não encontrada' });
      }
      res.json(rows[0]);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar ordem' });
  }
});

app.get('/api/dashboard', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
  
    const userLogin = req.user.login;
  
    try {
        const queryFaturadoDia = `
            SELECT SUM(valor) AS faturadoDia FROM tbos 
            WHERE status = 'Finalizado' AND DATE(data_os) = CURDATE();
        `;
        const queryFaturadoMes = `
            SELECT SUM(valor) AS faturadoMes FROM tbos 
            WHERE status = 'Finalizado' AND MONTH(data_os) = MONTH(CURDATE()) AND YEAR(data_os) = YEAR(CURDATE());
        `;
        const queryOrdensDia = `
            SELECT COUNT(*) AS ordensDia FROM tbos 
            WHERE status = 'Finalizado' AND DATE(data_os) = CURDATE();
        `;
        const queryOrdensMes = `
            SELECT COUNT(*) AS ordensMes FROM tbos 
            WHERE status = 'Finalizado' AND MONTH(data_os) = MONTH(CURDATE()) AND YEAR(data_os) = YEAR(CURDATE());
        `;
        const queryEmManutencao = `
            SELECT COUNT(*) AS emManutencao FROM tbos 
            WHERE status = 'Em Manutenção';
        `;
        const queryClientes = `
            SELECT COUNT(*) AS clientes FROM tbclientes;
        `;
  
        const [faturadoDiaResult] = await db.promise().query(queryFaturadoDia);
        const [faturadoMesResult] = await db.promise().query(queryFaturadoMes);
        const [ordensDiaResult] = await db.promise().query(queryOrdensDia);
        const [ordensMesResult] = await db.promise().query(queryOrdensMes);
        const [emManutencaoResult] = await db.promise().query(queryEmManutencao);
        const [clientesResult] = await db.promise().query(queryClientes);
  
        res.json({
            login: userLogin,
            faturadoDia: faturadoDiaResult[0].faturadoDia || 0,
            faturadoMes: faturadoMesResult[0].faturadoMes || 0,
            ordensDia: ordensDiaResult[0].ordensDia || 0,
            ordensMes: ordensMesResult[0].ordensMes || 0,
            emManutencao: emManutencaoResult[0].emManutencao || 0,
            clientes: clientesResult[0].clientes || 0
        });
    } catch (error) {
        console.error('Erro ao obter dados do dashboard:', error);
        res.status(500).json({ error: 'Erro ao obter dados do dashboard' });
    }
  });

app.post('/api/os', async (req, res) => {
  const { data_os, carro, placa, tecnico, valor, lista_servicos, servico, idclie, status } = req.body;

  try {
      await db.query(
          'INSERT INTO tbos (data_os, carro, placa, tecnico, valor, lista_servicos, servico, idclie, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [data_os, carro, placa, tecnico, valor, lista_servicos, servico, idclie, status]
      );
      res.status(201).send('Ordem criada com sucesso');
  } catch (error) {
      console.error('Erro ao criar ordem:', error);
      res.status(500).send('Erro ao criar ordem');
  }
});



app.get('/api/os/:id', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM tbos WHERE os = ?', [req.params.id]);
      if (rows.length === 0) {
          return res.status(404).send('Ordem não encontrada');
      }

      const ordem = rows[0];
      ordem.lista_servicos = JSON.parse(ordem.lista_servicos || '[]'); // Converter JSON para array

      res.json(ordem);
  } catch (error) {
      console.error('Erro ao buscar ordem:', error);
      res.status(500).send('Erro ao buscar ordem');
  }
});

app.get('/api/os', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbos ORDER BY os DESC');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar ordens:', error);
        res.status(500).json({ error: 'Erro ao buscar ordens' });
    }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
