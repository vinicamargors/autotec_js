const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibG9naW4iOiJhZG1pbiIsImlhdCI6MTcyNDM4MTgwMSwiZXhwIjoxNzI0Mzg1NDAxfQ.3--vPNavXR3Fz33BPSjs4KTJMv36cXWhp4hFu5Tmlsw'; // Substitua pelo token de autenticação
const apiUrl = 'http://localhost:3000/api/os'; // Substitua pela URL da sua API

const numOrders = 10000; // Número de ordens a serem inseridas

async function createOrder(index) {
    try {
        const response = await axios.post(apiUrl, {
            data_os: new Date().toISOString(),
            carro: `Carro ${index}`,
            placa: `ABC${index}`,
            tecnico: `Técnico ${index}`,
            valor: (index * 100).toFixed(2),
            servico: `Serviço ${index}`,
            idclie: Math.floor(Math.random() * 10) + 1, // Substitua pelo ID de cliente válido
            status: 'Orçamento',
            lista_servicos: JSON.stringify([
                { name: `Serviço ${index}`, price: (index * 100).toFixed(2) }
            ])
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(`Ordem ${index} criada com sucesso!`);
    } catch (error) {
        console.error(`Erro ao criar ordem ${index}:`, error.message);
    }
}

async function createOrders() {
    for (let i = 1; i <= numOrders; i++) {
        await createOrder(i);
    }
}

createOrders();
