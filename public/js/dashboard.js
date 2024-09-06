document.addEventListener('DOMContentLoaded', async () => {
    const token = document.cookie.split('sessionToken=')[1]?.split(';')[0]; // Verifica se o token está corretamente capturado
    if (!token) {
        console.error('Token de autenticação ausente');
        window.location.href = '/index.html';
        return;
    }
    
    try {
        const response = await fetch('/api/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Exibe as informações de faturamento
        document.getElementById('faturadoDia').textContent = `R$ ${parseFloat(data.faturadoDia).toFixed(2)}`;
        document.getElementById('faturadoMes').textContent = `R$ ${parseFloat(data.faturadoMes).toFixed(2)}`;
        document.getElementById('ordensDia').textContent = data.ordensDia;
        document.getElementById('ordensMes').textContent = data.ordensMes;
        document.getElementById('emManutencao').textContent = data.emManutencao;
        document.getElementById('clientes').textContent = data.clientes;

        // Verifica o login do usuário e oculta as informações de faturamento, se necessário
        if (data.login !== 'admin' && data.login !== 'fabiano') {
            document.querySelectorAll('.info-card').forEach(card => {
                card.style.display = 'none';
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }

    // Função para o botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Remove o token de autenticação
            document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Redireciona para a página de login
            window.location.href = '/index.html';
        });
    }
});
