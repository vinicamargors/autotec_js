document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const createOrderForm = document.getElementById('createOrderForm');
    const editOrderContainer = document.getElementById('editOrderContainer');
    const editOrderForm = document.getElementById('editOrderForm');
    const cancelEditButton = document.getElementById('cancelEdit');
    const idclieSelect = document.getElementById('idclie');
    const editIdclieSelect = document.getElementById('editIdclie');
    const addServiceButton = document.getElementById('addServiceButton');
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    const servicesList = document.getElementById('servicesList');
    const valorInput = document.getElementById('valor');
    const editValor = document.getElementById('editValor');
    const services = [];
    
    const token = document.cookie.split('sessionToken=')[1];
    if (!token) {
        console.error('Token de autenticação ausente');
        // Opcional: Redirecione o usuário para a página de login
        window.location.href = '/login.html';
        return;
    }

    addServiceButton.addEventListener('click', () => {
        const name = serviceNameInput.value.trim();
        const price = parseFloat(servicePriceInput.value);

        if (name && !isNaN(price)) {
            services.push({ name, price });
            updateServicesList();
            updateTotalValue();
            serviceNameInput.value = '';
            servicePriceInput.value = '';
        }
    });

    function updateServicesList() {
        servicesList.innerHTML = services.map((service, index) => `
            <li>${service.name} - R$${service.price.toFixed(2)}
                <button type="button" onclick="removeService(${index})">Remover</button>
            </li>
        `).join('');
    }

    function updateTotalValue() {
        const total = services.reduce((total, service) => total + service.price, 0);
        if (createOrderForm.style.display === 'none') {
            // Atualizar o valor do campo de edição
            if (editValor) {
                editValor.value = total.toFixed(2);
            }
        } else {
            // Atualizar o valor do campo de criação
            valorInput.value = total.toFixed(2);
        }
    }

    window.removeService = (index) => {
        services.splice(index, 1);
        updateServicesList();
        updateTotalValue();
    };

    let currentEditOrderId = null;

    async function loadOrders() {
        try {
            const response = await fetch('/api/os', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            // Verifique o tipo de conteúdo da resposta
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text(); // Leia o texto da resposta
                throw new Error(`Resposta inesperada: ${response.status} - ${errorText}`);
            }

            const ordens = await response.json();

            ordens.sort((a, b) => b.os - a.os);

            ordersTableBody.innerHTML = ordens.map(ordem => `
                <tr>
                    <td>${ordem.os}</td>
                    <td>${new Date(ordem.data_os).toLocaleDateString()}</td>
                    <td>${ordem.carro}</td>
                    <td>${ordem.placa}</td>
                    <td>${ordem.tecnico}</td>
                    <td>${ordem.valor}</td>
                    <td>${ordem.servico}</td>
                    <td>${ordem.cliente || 'Não disponível'}</td>
                    <td>${ordem.status}</td>
                    <td>
                        <button class="action-button edit-button" onclick="editOrder(${ordem.os})">Editar</button>
                        <button class="action-button delete-button" onclick="deleteOrder(${ordem.os})">Excluir</button>
                        <button class="action-button print-button" onclick="printOrder(${ordem.os})">Imprimir</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar ordens:', error);
        }
    }
    
    async function loadClients() {
        try {
            const response = await fetch('/api/clientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            // Verifique o tipo de conteúdo da resposta
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text(); // Leia o texto da resposta
                throw new Error(`Resposta inesperada: ${response.status} - ${errorText}`);
            }

            window.clientesCache = await response.json();

            idclieSelect.innerHTML = window.clientesCache.map(cliente => `
                <option value="${cliente.id}">${cliente.nome}</option>
            `).join('');

            editIdclieSelect.innerHTML = window.clientesCache.map(cliente => `
                <option value="${cliente.id}">${cliente.nome}</option>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    createOrderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createOrderForm);
        const data = {
            data_os: formData.get('data_os'),
            carro: formData.get('carro'),
            placa: formData.get('placa'),
            tecnico: formData.get('tecnico'),
            valor: parseFloat(valorInput.value),
            servico: formData.get('servico'),
            idclie: parseInt(formData.get('idclie')),
            status: formData.get('status'),
            lista_servicos: JSON.stringify(services)
        };

        try {
            const response = await fetch('/api/os', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na criação da ordem');
            }

            createOrderForm.reset();
            services.length = 0; // Limpar a lista de serviços
            updateServicesList(); // Atualizar a lista de serviços para refletir a limpeza
            updateTotalValue();
            loadOrders();
        } catch (error) {
            console.error('Erro ao criar ordem:', error);
        }
    });

    window.editOrder = async (id) => {
        try {
            const response = await fetch(`/api/os/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao buscar ordem: ${response.status} - ${errorText}`);
            }

            const ordem = await response.json();

            const editOrderId = document.getElementById('editOrderId');
            const editData_os = document.getElementById('editData_os');
            const editCarro = document.getElementById('editCarro');
            const editPlaca = document.getElementById('editPlaca');
            const editTecnico = document.getElementById('editTecnico');
            const editValor = document.getElementById('editValor');
            const editServico = document.getElementById('editServico');
            const editIdclieSelect = document.getElementById('editIdclie');
            const editStatusSelect = document.getElementById('editStatus');

            if (editOrderId && editData_os && editCarro && editPlaca && editTecnico && editValor && editServico && editIdclieSelect && editStatusSelect) {
                editOrderId.value = ordem.os;
                editData_os.value = new Date(ordem.data_os).toISOString().split('T')[0];
                editCarro.value = ordem.carro;
                editPlaca.value = ordem.placa;
                editTecnico.value = ordem.tecnico;
                editValor.value = ordem.valor;
                editServico.value = ordem.servico;
                editIdclieSelect.value = ordem.idclie;
                editStatusSelect.value = ordem.status;

                // Atualizar a lista de serviços
                if (ordem.lista_servicos) {
                    services.length = 0;
                    JSON.parse(ordem.lista_servicos).forEach(service => services.push(service));
                    updateServicesList();
                    updateTotalValue();
                }

                editOrderContainer.style.display = 'block';
                currentEditOrderId = id;
            } else {
                console.error('Um ou mais elementos de edição não foram encontrados no DOM.');
            }
        } catch (error) {
            console.error('Erro ao editar ordem:', error);
        }
    };

    window.deleteOrder = async (id) => {
        try {
            const response = await fetch(`/api/os/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir ordem: ${response.status} - ${errorText}`);
            }

            loadOrders();
        } catch (error) {
            console.error('Erro ao excluir ordem:', error);
        }
    };

    editOrderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(editOrderForm);
        const data = {
            data_os: formData.get('data_os'),
            carro: formData.get('carro'),
            placa: formData.get('placa'),
            tecnico: formData.get('tecnico'),
            valor: parseFloat(formData.get('valor')),
            servico: formData.get('servico'),
            idclie: parseInt(formData.get('idclie')),
            status: formData.get('status'),
            lista_servicos: JSON.stringify(services) // Adicione a lista de serviços
        };

        try {
            const response = await fetch(`/api/os/${currentEditOrderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na atualização da ordem');
            }

            editOrderContainer.style.display = 'none';
            services.length = 0; // Limpar a lista de serviços
            updateServicesList(); // Atualizar a lista de serviços para refletir a limpeza
            updateTotalValue();
            loadOrders();
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
        }
    });

    cancelEditButton.addEventListener('click', () => {
        editOrderContainer.style.display = 'none';
        currentEditOrderId = null;
        services.length = 0; // Limpar a lista de serviços
        updateServicesList(); // Atualizar a lista de serviços para refletir a limpeza
    });

    loadOrders();
    loadClients();
});
