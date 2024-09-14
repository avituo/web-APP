document.addEventListener('DOMContentLoaded', function() {
    function fetchContacts() {
        showLoader();
        fetch('https://deepskyblue-boar-319363.hostingersite.com/contacts')
            .then(response => response.json())
            .then(data => {
                populateContactTable(data);
                $('#contactsTable').DataTable({
                    language: {
                        "sEmptyTable": "Nenhum dado disponível na tabela",
                        "sInfo": "Mostrando _START_ até _END_ de _TOTAL_ registros",
                        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                        "sInfoFiltered": "(Filtrados de _MAX_ registros no total)",
                        "sLengthMenu": "Mostrar _MENU_ registros",
                        "sLoadingRecords": "Carregando...",
                        "sProcessing": "Processando...",
                        "sZeroRecords": "Nenhum registro encontrado",
                        "sSearch": "Buscar",
                        "oPaginate": {
                            "sNext": "Próximo",
                            "sPrevious": "Anterior",
                            "sFirst": "Primeiro",
                            "sLast": "Último"
                        },
                        "oAria": {
                            "sSortAscending": ": Ordenar colunas de forma ascendente",
                            "sSortDescending": ": Ordenar colunas de forma descendente"
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
            })
            .finally(() => {
                hideLoader();
            });
    }

    function populateContactTable(contacts) {
        const tbody = document.querySelector('#contactsTable tbody');
        tbody.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.id}</td>
                <td>${contact.user_id}</td>
                <td>${contact.type}</td>
                <td>${contact.value}</td>
                <td><button class="btn btn-warning btn-sm" onclick="editContact(${contact.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Apagar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    window.editContact = function(id) {
        alert('Editar contato com ID: ' + id);
    };

    window.deleteContact = function(id) {
        alert('Apagar contato com ID: ' + id);
    };

    document.getElementById('createContactForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userId = document.getElementById('userId').value;
        const contactType = document.getElementById('contactType').value;
        const contactValue = document.getElementById('contactValue').value;

        showLoader();

        fetch('https://deepskyblue-boar-319363.hostingersite.com/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                type: contactType,
                value: contactValue
            })
        })
            .then(response => response.json())
            .then(() => {
                alert('Sucesso')
                const createContactModal = bootstrap.Modal.getInstance(document.getElementById('createContactModal'));
                createContactModal.hide();
            })
            .catch(error => {
                console.error('Erro ao criar o contato:', error);
                alert('Erro')
            })
            .finally(() => {
                hideLoader();
                location.reload();
            });
    });

    fetchContacts();
});
