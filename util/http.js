import axios from "axios";

const BACKEND_URL =
  "https://react-native-course-633b5-default-rtdb.asia-southeast1.firebasedatabase.app";

// cara menggunakan axios
// ingat sebisa mungkin selalu gunakan async await ketika ingin mengambil response
export async function storeExpense(expenseData) {
  // post axios
  // axios.post("url", data_yang_akan_disimpan)
  const response = await axios.post(
    BACKEND_URL + "/expenses.json",
    expenseData
  );
  const id = response.data.name; // name, merupakan id unik yang dimiliki/didapatkan dari firebase
  return id;
}

// axios fetch / get
export async function fetchExpenses() {
  const response = await axios.get(BACKEND_URL + "/expenses.json");

  const expenses = [];

  console.log(response.data);

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }
  return expenses;
}

export function updateExpense(id, expenseData) {
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
}

export function deleteExpense(id) {
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}
