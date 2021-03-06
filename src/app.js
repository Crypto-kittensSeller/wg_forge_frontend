import companies from '../data/companies.json';
import orders from '../data/orders.json';
import users from '../data/users.json';
import './css/styles.css';
import sortTable from './sorter';
import renderStatistics from './statisticsGenerator';
import 'bootstrap';

const moment = require('moment');


function generateUserName(userOfCurrentOrder) {
  let prefix = '';
  if (userOfCurrentOrder.gender === 'Male') prefix = 'Mr.';
  if (userOfCurrentOrder.gender === 'Female') prefix = 'Ms.';
  const userInfo = `${prefix} ${userOfCurrentOrder.first_name} ${userOfCurrentOrder.last_name}`;
  return userInfo;
}

function generateUserBirtday(userOfCurrentOrder) {
  if (!userOfCurrentOrder.birthday) return;
  const userBirthday = moment(userOfCurrentOrder.birthday * 1000);
  const userFormattedBirthday = userBirthday.format('DD/MM/YYYY');
  return userFormattedBirthday;
}

class OrdersTable {
  static renderTableHeaders() {
    const mainContainer = document.getElementById('app');
    const info = `
        <table class="table table-dark table-hover">
          <thead id='tableHeader'>
            <tr class="bg-primary">
                <th class='clickable' data-columnName='Transaction ID'>Transaction ID</th>
                <th class='clickable' data-columnName='User Info'>User Info</th>
                <th class='clickable' data-columnName='Order Date'>Order Date</th>
                <th class='clickable' data-columnName='Order Amount'>Order Amount</th>
                <th>Card Number</th>
                <th class='clickable' data-columnName='Card Type'>Card Type</th>
                <th class='clickable' data-columnName='Location'>Location</th>
            </tr>
            <tr>
              <th>Search:</th>
              <th colspan='6'><input type='text' id='search'></th>
            </tr>
          </thead>
          <tbody id='tableBody'>
          </tbody>
        </table>`;
    mainContainer.innerHTML = info;
  }

  static renderTableBody() {
    const tbody = document.getElementById('tableBody');
    let info = '';
    orders.map((order) => {
      const orderDate = moment(order.created_at * 1000);
      const formattedOrderDate = orderDate.format('DD/MM/YYYY hh:mm:ss');
      const numbersArr = order.card_number.split('');
      const hideMiddleNumbers = numbersArr.map((number, i) => {
        if (i > 1 && i < (numbersArr.length - 4)) {
          number = '*';
          return number;
        }
        return number;
      });
      const cardNumber = hideMiddleNumbers.join('');
      const userOfCurrentOrder = users.find(user => order.user_id === user.id);
      const companyOfCurrentUser = companies.find(company => userOfCurrentOrder.company_id === company.id) || '';
      const userInfo = generateUserName(userOfCurrentOrder);
      const userBirthday = generateUserBirtday(userOfCurrentOrder);
      info += `
      <tr id='order_${order.id}' style='display: table-row'>
        <td>${order.transaction_id}</td>
        <td class='user_data'>
          <a href='#' class='user-info'>${userInfo}</a>
          <div class='user-details'>
          <p>${userBirthday || ''}</p>
          <p><img src="${userOfCurrentOrder.avatar}" width='100px' alt='avatar'></p>
          <p>Company: <a href="${companyOfCurrentUser.url || 'n/a'}" target='_blank'>${companyOfCurrentUser.title || 'n/a'}</a></p>
          <p>Industry: ${companyOfCurrentUser.sector || 'n/a'}</p>
          </div>
        </td>
        <td class='order_date'>${formattedOrderDate}</td>
        <td class='order_price-js'>$${order.total}</td>
        <td class='card_number'>${cardNumber}</td>
        <td>${order.card_type}</td>
        <td>${order.order_country} (${order.order_ip})</td>
      </tr>
    `;
    });
    tbody.innerHTML = info;
    tbody.innerHTML += renderStatistics();
  }
}

OrdersTable.renderTableHeaders();
OrdersTable.renderTableBody();

const table = document.getElementsByTagName('table')[0];
table.addEventListener('click', (e) => {
  if (e.target.className !== 'user-info') return;
  e.preventDefault();
  e.target.nextSibling.nextSibling.classList.toggle('user-details');
});

const tableHeader = document.getElementById('tableHeader');
tableHeader.addEventListener('click', (e) => {
  if (e.target.className !== 'clickable') return;
  const arrow = '<span>&#8595;</span>';
  if (e.target.innerHTML.includes('span')) return;
  tableHeader.children[0].childNodes.forEach((elem) => {
    if (elem.innerHTML) {
      if (elem.innerHTML.includes('span')) elem.innerHTML = elem.innerHTML.substr(0, elem.innerHTML.length - 14);
    }
  });
  e.target.innerHTML += arrow;
  sortTable(e.target.cellIndex, e.target.getAttribute('data-columnName'));
});

const search = document.getElementById('search');
search.addEventListener('input', () => {
  const tableBody = document.getElementsByTagName('tbody')[0];
  const regPhrase = new RegExp(search.value, 'i');
  let flag = false;
  let smthFound = false;
  for (let i = tableBody.children.length - 1; i >= 0; i--) {
    if (tableBody.children[i].className === 'statistics-js') {
      tableBody.removeChild(tableBody.children[i]);
    }
  }
  if (tableBody.childNodes[1].id === 'notFound') {
    const nothingFound = document.getElementById('notFound');
    tableBody.removeChild(nothingFound);
  }
  for (let i = 0; i < orders.length; i++) {
    flag = false;
    for (let j = tableBody.rows[i].cells.length - 1; j >= 0; j--) {
      if (j === 1) {
        flag = regPhrase.test(tableBody.rows[i].cells[1].childNodes[1].innerHTML);
      } else {
        flag = regPhrase.test(tableBody.rows[i].cells[j].innerHTML);
      }
      if (flag) break;
    }
    if (flag) {
      tableBody.rows[i].style.display = 'table-row';
      smthFound = true;
    } else {
      tableBody.rows[i].style.display = 'none';
    }
  }
  if (!smthFound) {
    const nothingFound = `
      <tr id='notFound' class="bg-danger">
        <td class='notFound' colspan='7' >Nothing found</td>
      </tr>
      `;
    if (tableBody.childNodes[1].id !== 'notFound') {
      tableBody.insertAdjacentHTML('afterbegin', nothingFound);
    }
  }
  tableBody.innerHTML += renderStatistics();
});
