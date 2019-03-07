import orders from '../data/orders.json';
import users from '../data/users.json';


function generateStatistics() {
    const statisticsInfo = {};
    statisticsInfo.totalOrders = orders.length;
    statisticsInfo.totalSum = orders.reduce((totalSum, order) => totalSum + +order.total, 0).toFixed(2);
  
    statisticsInfo.median = function calculateMedian() {
      const allOrdersPrices = [];
      let median = 0;
      orders.forEach( order => allOrdersPrices.push(+order.total));
      allOrdersPrices.sort( (a, b) => a - b);
      if (orders.length % 2 !== 0) {
        median = allOrdersPrices[orders.length / 2].toFixed(2);
      } else {
        median = ((allOrdersPrices[orders.length / 2] + allOrdersPrices[(orders.length / 2) - 1]) / 2).toFixed(2);
      }
      return median
    }
  
    statisticsInfo.averageCheck = (statisticsInfo.totalSum / statisticsInfo.totalOrders).toFixed(2);
  
    statisticsInfo.averageMaleCheck = function countMaleAverageCheck() {
      const maleOrdersPrices = [];
      let maleOrdersCounter = 0;
      let maleAverageCheck = 0;
      orders.map( order => {
        const userOfCurrentOrder = users.find( user => {
          return order.user_id === user.id;
        });
        if (userOfCurrentOrder.gender === 'Male') {
          maleOrdersCounter++;
          maleOrdersPrices.push(order.total);
        }
      })
      maleAverageCheck = (maleOrdersPrices.reduce((totalSum, price) => totalSum + +price, 0) / maleOrdersCounter).toFixed(2);
      return maleAverageCheck;
    };
  
    statisticsInfo.averageFemaleCheck = function countFemaleAverageCheck() {
      const femaleOrdersPrices = [];
      let femaleOrdersCounter = 0;
      let femaleAverageCheck = 0;
      orders.map( order => {
        const userOfCurrentOrder = users.find( user => {
          return order.user_id === user.id;
        });
        if (userOfCurrentOrder.gender === 'Female') {
          femaleOrdersCounter++;
          femaleOrdersPrices.push(order.total);
        }
      })
      femaleAverageCheck = (femaleOrdersPrices.reduce((totalSum, price) => totalSum + +price, 0) / femaleOrdersCounter).toFixed(2);
      return femaleAverageCheck;
    };
    return statisticsInfo;
  }

  export default generateStatistics;