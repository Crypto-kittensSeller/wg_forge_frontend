import companies from '../data/companies.json';
import orders from '../data/orders.json';
import users from '../data/users.json';
import './styles.css';
import sortTable from './sorter.js';
import generateStatistics from './statisticsGenerator.js';
const moment = require('moment');


class OrdersTable {
 
  static renderTableHeaders() {
    const mainContainer = document.getElementById('app');
    let info = `
        <table>
          <thead id='tableHeader'>
            <tr>
                <th class='clickable' data-columnName='Transaction ID'>Transaction ID</th>
                <th class='clickable' data-columnName='User Info'>User Info</th>
                <th class='clickable' data-columnName='Order Date'>Order Date</th>
                <th class='clickable' data-columnName='Order Amount'>Order Amount</th>
                <th>Card Number</th>
                <th class='clickable' data-columnName='Card Type'>Card Type</th>
                <th class='clickable' data-columnName='Location'>Location</th>
            </tr>
          </thead>
          <tbody id='tableBody'>
          </tbody>
        </table>`;
      mainContainer.innerHTML = info;
    };


  static renderTableBody() {
    const tbody = document.getElementById('tableBody');
    let info = '';
    orders.map( order => {
      const orderDate = moment(order.created_at*1000);
      const formattedOrderDate = orderDate.format('DD/MM/YYYY hh:mm:ss');
      const numbersArr = order.card_number.split("");
      const hideMiddleNumbers = numbersArr.map( (number, i) => {
        if (i > 1 && i < (numbersArr.length - 4)) {
         return number = '*';
        }
        return number;
      });
      const cardNumber = hideMiddleNumbers.join('');
      const userOfCurrentOrder = users.find( user => {
        return order.user_id === user.id;
      });
      const companyOfCurrentUser = companies.find( company => {
        return userOfCurrentOrder.company_id === company.id
      }) || '';
      const userInfo = generateUserName(userOfCurrentOrder);
      const userBirthday = generateUserBirtday(userOfCurrentOrder);
      
      info += `
      <tr id='order_${order.id}'>
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
        <td>${formattedOrderDate}</td>
        <td>$${order.total.replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
        <td>${cardNumber}</td>
        <td>${order.card_type}</td>
        <td>${order.order_country} (${order.order_ip})</td>
      </tr>
    `
    })
    tbody.innerHTML = info;
    const statisticsInfo = generateStatistics();

     let statistics = `
      <tr>
      <td colspan='6'>Orders Count</td>
      <td>${statisticsInfo.totalOrders}</td>
  </tr>
  <tr>
      <td colspan='6'>Orders Total</td>
      <td>$${statisticsInfo.totalSum}</td>
  </tr>
  <tr>
      <td colspan='6'>Median Value</td>
      <td>$${statisticsInfo.median()}</td>
  </tr>
  <tr>
      <td colspan='6'>Average Check</td>
      <td>$${statisticsInfo.averageCheck}</td>
  </tr>
  <tr>
      <td colspan='6'>Average Check (Female)</td>
      <td>$${statisticsInfo.averageFemaleCheck()}</td>
  </tr>
  <tr>
      <td colspan='6'>Average Check (Male)</td>
      <td>$${statisticsInfo.averageMaleCheck()}</td>
  </tr>
      `
      tbody.innerHTML += statistics;   
  }
};

function generateUserName(userOfCurrentOrder) {
  let prefix = '';
  if (userOfCurrentOrder.gender === "Male") prefix = 'Mr.';
  if (userOfCurrentOrder.gender === "Female") prefix = 'Ms.';
  const userInfo = prefix + ' ' + userOfCurrentOrder.first_name + ' ' + userOfCurrentOrder.last_name;
  return userInfo;
}

function generateUserBirtday(userOfCurrentOrder) {
  if (!userOfCurrentOrder.birthday) return;
  const userBirthday = moment(userOfCurrentOrder.birthday*1000);
  const userFormattedBirthday = userBirthday.format('DD/MM/YYYY');
  return userFormattedBirthday;
}

OrdersTable.renderTableHeaders();
OrdersTable.renderTableBody();

const table = document.getElementsByTagName('table')[0];
table.addEventListener('click', (e) => {
  if (e.target.className !== 'user-info') return;
  e.preventDefault();
  e.target.nextSibling.nextSibling.classList.toggle('user-details');
})

const tableHeader = document.getElementById('tableHeader');
tableHeader.addEventListener( 'click', (e) => {
  if (e.target.className !== 'clickable') return;
  const arrow = '<span>&#8595;</span>';
  if (e.target.innerHTML.includes('span')) return;
  tableHeader.children[0].childNodes.forEach( elem => {
    if (elem.innerHTML){
    if (elem.innerHTML.includes('span')) elem.innerHTML = elem.innerHTML.substr(0, elem.innerHTML.length - 14);
    }
  });
  e.target.innerHTML += arrow;
  sortTable(e.target.cellIndex, e.target.getAttribute('data-columnName'));
})
