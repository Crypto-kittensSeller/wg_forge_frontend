import companies from '../data/companies.json';
import orders from '../data/orders.json';
import users from '../data/users.json';
const moment = require('moment');


class OrdersTable {
 
  static renderTableHeaders() {
    const mainContainer = document.getElementById('app');
    let info = `
        <table>
          <thead>
            <tr>
                <th>Transaction ID</th>
                <th>User Info</th>
                <th>Order Date</th>
                <th>Order Amount</th>
                <th>Card Number</th>
                <th>Card Type</th>
                <th>Location</th>
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
      const userInfo = generateUserName(userOfCurrentOrder);
      info += `
      <tr id='order_${order.id}'>
        <td>${order.transaction_id}</td>
        <td class='user_data'>
          <a href='#'>${userInfo}</a>
        </td>
        <td>${formattedOrderDate}</td>
        <td>$${order.total}</td>
        <td>${cardNumber}</td>
        <td>${order.card_type}</td>
        <td>${order.order_country} (${order.order_ip})</td>
      </tr>
    `
    })
    tbody.innerHTML = info;
  }
};

function generateUserName(userOfCurrentOrder) {
  let prefix = '';
  if (userOfCurrentOrder.gender === "Male") prefix = 'Mr.';
  if (userOfCurrentOrder.gender === "Female") prefix = 'Ms.';
  const userInfo = prefix + ' ' + userOfCurrentOrder.first_name + ' ' + userOfCurrentOrder.last_name;
  return userInfo;
}

OrdersTable.renderTableHeaders();
OrdersTable.renderTableBody();
