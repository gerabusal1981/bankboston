// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

// Datos simulados: transferencias mensuales de enero 2019 a diciembre 2024
const transfers = [];
(function generateTransfers() {
  let start = new Date(2019, 0, 31);
  const end = new Date(2024, 11, 31);
  const baseAmount = 62500; // Monto base de 62,500 USD
  // IPC approx monthly indices (relative to 100 in Jan 2019)
  const ipc = [
    100.0, 100.3, 100.6, 100.8, 101.0, 101.4, 101.7, 102.0, 102.3, 102.6, 102.9, 103.3,
    103.5, 103.8, 104.0, 104.2, 104.6, 104.9, 105.3, 105.7, 106.0, 106.4, 106.8, 107.2,
    107.6, 108.0, 108.5, 109.0, 109.5, 110.0, 110.6, 111.2, 111.8, 112.4, 113.0, 113.7,
    114.3, 114.9, 115.5, 116.1, 116.8, 117.5, 118.2, 119.0, 119.8, 120.6, 121.4, 122.2,
    123.0, 123.6, 124.3, 125.0, 125.8, 126.6, 127.4, 128.2, 129.0, 129.8, 130.6, 131.5,
    132.4, 133.3, 134.2, 135.1, 136.0, 137.0, 138.0, 139.0, 140.0, 141.0, 142.0, 143.0
  ];

  let i = 0;
  while (start <= end) {
    const month = start.toLocaleString('default', { month: 'short', year: 'numeric' });
    const amount = (baseAmount * (ipc[i] / 100)).toFixed(2);
    transfers.push({ month, amount });
    start.setMonth(start.getMonth() + 1);
    i++;
  }
})();

// Función para llenar tabla con transferencias
function populateTransferTable() {
  const tbody = document.querySelector('#transferTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  transfers.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t.month}</td><td>$${t.amount}</td><td>Processed</td>`;
    tbody.appendChild(tr);
  });
}

// Exportar CSV
function exportCSV() {
  const header = ['Month', 'Amount (USD)', 'Status'];
  const rows = transfers.map(t => [t.month, t.amount, 'Processed']);
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += header.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'bankofboston_transfers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Agregar eventos al cargar la página
window.addEventListener('load', () => {
  populateTransferTable();

  // Botón de exportación CSV
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportCSV);
  }

  // Botones de acciones
  const transferBtn = document.getElementById('transferBtn');
  const reportBtn = document.getElementById('reportBtn');
  
  if (transferBtn) {
    transferBtn.addEventListener('click', () => alert('Transfer function is under development.'));
  }
  if (reportBtn) {
    reportBtn.addEventListener('click', () => alert('Annual report function is under development.'));
  }

  // Generar gráfico si existe el elemento
  if (document.getElementById('balanceChart')) {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: transfers.map(t => t.month),
        datasets: [{
          label: 'Monthly Transfers (USD)',
          data: transfers.map(t => t.amount),
          borderColor: '#003366',
          backgroundColor: 'rgba(0,51,102,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Monthly Transfers Over Time' }
        }
      }
    });
  }
});
