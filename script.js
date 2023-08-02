document.addEventListener('DOMContentLoaded', () => {

    // Obtém as referências aos elementos do DOM com os IDs 'calcularBtn', 'historicoBtn' e 'historicoBody'.
    const calcularBtn = document.getElementById('calcularBtn');
    const historicoBtn = document.getElementById('historicoBtn');
    const historicoBody = document.getElementById('historicoBody');
  
    // Função para realizar o cálculo e enviar os dados para o servidor
    const calcularHipotenusa = () => {
      const catetoOposto = parseFloat(document.getElementById('catetoOposto').value);
      const catetoAdjacente = parseFloat(document.getElementById('catetoAdjacente').value);
  
      if (!isNaN(catetoOposto) && !isNaN(catetoAdjacente)) {
        const hipotenusa = Math.sqrt(Math.pow(catetoOposto, 2) + Math.pow(catetoAdjacente, 2));
        document.getElementById('hipotenusaValor').innerText = hipotenusa.toFixed(2);
  
        // Enviar os dados para o servidor usando fetch
        fetch('/calcular', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ catetoOposto, catetoAdjacente })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Dados enviados com sucesso:', data);
        })
        .catch(error => {
          console.error('Erro ao enviar os dados:', error);
        });
      }
    };
  
    // Adiciona um evento de clique ao botão com o ID 'calcularBtn'.
    calcularBtn.addEventListener('click', () => {
      calcularHipotenusa();
    });
  
    // Adiciona um evento de clique ao botão com o ID 'historicoBtn'.
    historicoBtn.addEventListener('click', () => {
      // Realiza uma requisição fetch para a rota '/historico' do servidor.
      fetch('/historico')
        // Converte a resposta para JSON.
        .then(response => response.json())
        // Após a conversão, processa os dados retornados (histórico de consultas).
        .then(data => {
          // Limpa o conteúdo atual da tabela 'historicoBody'.
          historicoBody.innerHTML = '';
  
          // Itera sobre cada consulta no histórico recebido.
          data.forEach(consulta => {
            // Cria uma nova linha (row) da tabela (tr) para cada consulta.
            const row = document.createElement('tr');
            // Preenche a nova linha com os dados da consulta usando templates de string.
            row.innerHTML = `
              <td>${consulta.catetoOposto}</td>
              <td>${consulta.catetoAdjacente}</td>
              <td>${consulta.hipotenusa.toFixed(2)}</td>
              <td>${new Date(consulta.timestamp).toLocaleString()}</td>
            `;
            // Adiciona a nova linha à tabela 'historicoBody'.
            historicoBody.appendChild(row);
          });
        })
        // Em caso de erro na requisição, exibe uma mensagem de alerta.
        .catch(error => {
          console.error('Erro ao obter o histórico:', error.message);
          alert('Erro ao obter o histórico de consultas.');
        });
    });
  
  });
