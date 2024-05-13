import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

const ExpenseForm = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
}) => {
  // dengan cara dibawah kita bisa mengkontrol untuk add dan update tampilan form sekaligus
  const [inputs, setInputs] = useState({
    // jika sudah terdapat value, maka form input sudah berisi value yang sudah ada, jika belum ada maka inputan kosong
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      //   isvalid: defaultValues ? true : false,
      //   isValid: !!defaultValues, // kode disamping sama dengan kode diatas
      isValid: true,
    },
    // date: defaultValues ? defaultValues.date.toISOString().slice(0, 10) : "",
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      //   isValid: defaultValues ? true : false,
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      //   isValid: defaultValues ? true : false,
      isValid: true,
    },
  });

  //   dengan cara dibawah kita bisa mengkontrol beberapa jenis inputan sekaligus seperti amount, date dan description
  //   parameter enteredValue akan otomatis dibaca oleh react native di dalam onChangeText berisikan inputan user
  //   parameter inputIdentifier kita tentukan dengan menggunakan bind dibawah
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    // collecting input values
    const expenseData = {
      amount: +inputs.amount.value, //dengan + ini kita konversi bisa string ke number
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    // input validation

    //amountIsValid true jiak inputan berupa angka dan lebih dari 0
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    // dateIsValid true jika inputan berupa tanggal yang valid
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    // descriptionIsValid true jika inputan berupa string
    const descriptionIsValid = expenseData.description.trim().length > 0;

    // jika salah satu dari input tidak valid / not true / kosong maka munculkan alert
    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      //   Alert.alert("Invalid input", "Please check your input values");
      setInputs((currentInputs) => {
        return {
          amount: { value: currentInputs.amount.value, isValid: amountIsValid },
          date: { value: currentInputs.date.value, isValid: dateIsValid },
          description: {
            value: currentInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "amount"),
            value: inputs.amount.value,
          }}
        />

        <Input
          label="Date"
          invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10, //kita hanya butuh 10 digit maksimal
            onChangeText: inputChangedHandler.bind(this, "date"),
            value: inputs.date.value,
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autocorrect: false //default is true
          // autoCapitalize: 'characters', dll
          onChangeText: inputChangedHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input valuse - pelase check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
