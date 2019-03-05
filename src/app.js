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
      info += `
      <tr id='order_${order.id}'>
        <td>${order.transaction_id}</td>
        <td class='user_data'>${order.user_id}</td>
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

OrdersTable.renderTableHeaders();
OrdersTable.renderTableBody();
