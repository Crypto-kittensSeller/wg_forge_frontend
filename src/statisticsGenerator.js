import orders from '../data/orders.json';


function generateStatistics() {
  const statisticsInfo = {};
  const tableBody = document.getElementsByTagName('tbody')[0];
  const tableRows = [].slice.call(tableBody.rows).slice(0, orders.length);

  statisticsInfo.totalOrders = function visibleOrdersCount() {
    let ordersCounter = 0;
    tableRows.forEach((row) => {
      if (row.style.display === 'table-row') ordersCounter++;
    });
    return ordersCounter;
  };

  statisticsInfo.totalSum = function visibleOrdersSum() {
    const ordersPrices = [];
    tableRows.forEach((row) => {
      if (row.style.display === 'table-row') {
        row.childNodes.forEach((child) => {
          if (child.classList && child.classList.value === 'order_price-js') {
            ordersPrices.push(child.innerHTML.slice(1));
          }
        });
      }
    });
    return ordersPrices.reduce((totalSum, price) => totalSum + +price, 0).toFixed(2);
  };

  statisticsInfo.median = function calculateMedian() {
    const ordersPrices = [];
    let median = 0;
    tableRows.forEach((row) => {
      if (row.style.display === 'table-row') {
        row.childNodes.forEach((child) => {
          if (child.classList && child.classList.value === 'order_price-js') {
            ordersPrices.push(child.innerHTML.slice(1));
          }
        });
      }
    });
    ordersPrices.sort((a, b) => a - b);
    if (ordersPrices.length % 2 !== 0) {
      median = ordersPrices[(ordersPrices.length - 1) / 2];
    } else {
      median = ((+ordersPrices[ordersPrices.length / 2]
                + +ordersPrices[(ordersPrices.length / 2) - 1]) / 2).toFixed(2);
    }
    return median;
  };

  statisticsInfo.averageCheck = (statisticsInfo.totalSum()
                                 / statisticsInfo.totalOrders()).toFixed(2);

  statisticsInfo.averageMaleCheck = function countMaleAverageCheck() {
    const maleOrdersPrices = [];
    let maleOrdersCounter = 0;
    let maleAverageCheck = 0;
    tableRows.forEach((row) => {
      if (row.style.display === 'table-row') {
        row.childNodes.forEach((child) => {
          if (child.classList
            && child.classList.value === 'user_data'
            && child.children[0].innerHTML.slice(0, 3) === 'Mr.') {
            maleOrdersCounter++;
            row.childNodes.forEach((child) => {
              if (child.classList && child.classList.value === 'order_price-js') {
                maleOrdersPrices.push(child.innerHTML.slice(1));
              }
            });
          }
        });
      }
    });
    maleAverageCheck = (maleOrdersPrices.reduce((totalSum, price) => totalSum + +price, 0)
                        / maleOrdersCounter).toFixed(2);
    if (maleOrdersPrices.length === 0) {
      return 'n/a';
    } else {
      return `$${maleAverageCheck}`;
    }
  };

  statisticsInfo.averageFemaleCheck = function countFemaleAverageCheck() {
    const femaleOrdersPrices = [];
    let femaleOrdersCounter = 0;
    let femaleAverageCheck = 0;
    tableRows.forEach((row) => {
      if (row.style.display === 'table-row') {
        row.childNodes.forEach((child) => {
          if (child.classList
            && child.classList.value === 'user_data'
            && child.children[0].innerHTML.slice(0, 3) === 'Ms.') {
            femaleOrdersCounter++;
            row.childNodes.forEach((child) => {
              if (child.classList && child.classList.value === 'order_price-js') {
                femaleOrdersPrices.push(child.innerHTML.slice(1));
              }
            });
          }
        });
      }
    });
    femaleAverageCheck = (femaleOrdersPrices.reduce((totalSum, price) => totalSum + +price, 0)
                          / femaleOrdersCounter).toFixed(2);
    if (femaleOrdersPrices.length === 0) {
      return 'n/a';
    } else {
      return `$${femaleAverageCheck}`;
    }
  };
  return statisticsInfo;
}

function renderStatistics() {
  const statisticsInfo = generateStatistics();
  let statistics = '';
  if (statisticsInfo.totalOrders() === 0) {
    statistics += `
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Orders Count</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Orders Total</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Median Value</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check (Female)</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check (Male)</td>
        <td class='bg-info'><span>n/a</span></td>
      </tr>
      `;
  } else {
    statistics += `
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Orders Count</td>
        <td class='bg-info'>${statisticsInfo.totalOrders()}</td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Orders Total</td>
        <td class='bg-info'>$${statisticsInfo.totalSum()}</td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Median Value</td>
        <td class='bg-info'>$${statisticsInfo.median()}</td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check</td>
        <td class='bg-info'>$${statisticsInfo.averageCheck}</td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check (Female)</td>
        <td class='bg-info'>${statisticsInfo.averageFemaleCheck()}</td>
      </tr>
      <tr class='statistics-js'>
        <td class='bg-info' colspan='6'>Average Check (Male)</td>
        <td class='bg-info'>${statisticsInfo.averageMaleCheck()}</td>
      </tr>
      `;
  }
  return statistics;
}

export default renderStatistics;
