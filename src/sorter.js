import orders from '../data/orders.json';


function sortTable(columnNumber, column) {
  const table = document.getElementsByTagName('table')[0];
  const tableBody = document.getElementsByTagName('tbody')[0];
  const tableAllRows = [].slice.call(tableBody.rows);
  const statisticsRows = tableAllRows.slice(orders.length);
  const tableRows = tableAllRows.slice(0,orders.length);
  let compare;
  switch (column) {
    case 'Order Amount':
      compare = function(rowA, rowB) {
        return rowA.cells[columnNumber].innerHTML.slice(1) - rowB.cells[columnNumber].innerHTML.slice(1);
      };
      break;
    case 'Order Date':
      compare = function(rowA, rowB) {
        const dateDateA = rowA.cells[columnNumber].innerHTML.slice(0,10).split('/').reverse();
        const dateTimeA =  rowA.cells[columnNumber].innerHTML.slice(11).split(':');
        const dateA = dateDateA.concat(dateTimeA).join();
        const dateDateB = rowB.cells[columnNumber].innerHTML.slice(0,10).split('/').reverse();
        const dateTimeB =  rowB.cells[columnNumber].innerHTML.slice(11).split(':');
        const dateB = dateDateB.concat(dateTimeB).join();
        return dateA < dateB ? -1 : (dateA > dateB ? 1 : 0);
      };
        break;
    case 'Transaction ID':
      compare = function(rowA, rowB) {
        const a = rowA.cells[columnNumber].innerHTML;
        const b = rowB.cells[columnNumber].innerHTML;
        return a < b ? -1 : (a > b ? 1 : 0);
      };
      break;
    case 'User Info':
      compare = function(rowA, rowB) {
        const a = rowA.cells[columnNumber].children[0].innerHTML.slice(4);
        const b = rowB.cells[columnNumber].children[0].innerHTML.slice(4);
        return a < b ? -1 : (a > b ? 1 : 0);
      };
      break;
    case 'Card Type':
      compare = function(rowA, rowB) {
        const a = rowA.cells[columnNumber].innerHTML;
        const b = rowB.cells[columnNumber].innerHTML;
        return a < b ? -1 : (a > b ? 1 : 0);
      };
      break;
    case 'Location':
      compare = function(rowA, rowB) {
        const a = rowA.cells[columnNumber].innerHTML;
        const b = rowB.cells[columnNumber].innerHTML;
        return a < b ? -1 : (a > b ? 1 : 0);
      };
      break;
  }
  tableRows.sort(compare);
  table.removeChild(tableBody);
  
  tableRows.forEach(row => {
    tableBody.appendChild(row);
  });
  statisticsRows.forEach(row => {
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
}

export default sortTable;
