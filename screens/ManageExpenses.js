import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses.context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

// reminder bahwa props route & navigation didapatkan karena file berupa screen
const ManageExpenses = ({ route, navigation }) => {
  // useState untuk mengkontrol loading overlay
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState();
  // menggunakan context
  const expenseCtx = useContext(ExpensesContext);
  // memberikan ? pada params? untuk mengecek apakah param undefined
  // cara ini dilkaukan agar jaga2 jika params undefined
  const editedExpenseId = route.params?.expenseId; // ini dikirim dari ExpenseItem
  // memberikan !! di kode dibawah trick untuk mengkonversi value menjadi boolean
  const isEditing = !!editedExpenseId;

  const selectedExpense = expenseCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // title secara dinamis
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId);
      expenseCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later.");
      setIsSubmitting(false);
    }
    // delete expense pada firebase
    // await deleteExpense(editedExpenseId);
    // setelah itu delete expense pada context
    //   expenseCtx.deleteExpense(editedExpenseId);
    // panggil fungsi delete dari expense context
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // update secara local pada context
        expenseCtx.updateExpense(editedExpenseId, expenseData);
        // setelah itu update di firebase
        await updateExpense(editedExpenseId, expenseData);
      } else {
        // storeExpense() fungsi yang ada di file http.js
        const id = await storeExpense(expenseData);
        expenseCtx.addExpense({ ...expenseData, id: id }); // sekarang kita menggunakan id milik firebase
        // expenseCtx.addExpense(expenseData);
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later.");
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }
  // error overlay
  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  // Loading Overlay
  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />
      {/* <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={cancelHandler}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </View> */}
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  // buttons: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // button: {
  //   minWidth: 120,
  //   marginHorizontal: 8,
  // },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
