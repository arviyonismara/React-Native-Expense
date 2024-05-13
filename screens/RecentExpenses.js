import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses.context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const RecentExpenses = () => {
  // loading overlay
  const [isFetching, setIsFetching] = useState(true);

  // error overlay
  const [error, setError] = useState();

  const expenseCtx = useContext(ExpensesContext);
  // const [fetchedExpenses, setFetchedExpenses] = useState([]);

  // implementasi useEffect untukmendapatkan data / fetch data dari firebase
  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);

      try {
        const expenses = await fetchExpenses();
        expenseCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      }

      setIsFetching(false);
      // setFetchedExpenses(expenses);
      // expenseCtx.setExpenses(expenses);
    }
    getExpenses();
  }, []);

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  // munculkan data terkini yang kurang dari 7 hari
  // const recentExpenses = expenseCtx.expenses.filter((expense) => {
  // mencoba menggunakan data dari hasil fetch
  // const recentExpenses = fetchedExpenses.filter((expense) => {
  const recentExpenses = expenseCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date > date7DaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No Expenses Registered for the last 7 days"
    />
  );
};

export default RecentExpenses;

const styles = StyleSheet.create({});
