class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // submit budget
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (!value || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `Value cannot be empty or negative.`;

      const that = this;
      setTimeout(function() {
        that.budgetFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = null;
      this.showBalance();
    }
  }

  showBalance() {
    const expense = this.totalExpense();
    // console.log(expense);
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if (!expenseValue || !amountValue || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `Value cannot be empty or negative.`;

      const that = this;
      setTimeout(function() {
        that.expenseFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      const amount = parseInt(amountValue);
      this.expenseInput.value = null;
      this.amountInput.value = null;

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount
      };
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>`;

    this.expenseList.appendChild(div);
  }

  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.map(el => el.amount).reduce((a, b) => a + b, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  editExpense(element) {
    let id = parseInt(element.getAttribute("data-id"));
    // remove from dom
    let expense = this.itemList.find(el => el.id === id);
    // remove from list
    this.deleteExpense(element);

    this.expenseInput.value = expense.title;
    this.amountInput.value = expense.amount;
  }

  deleteExpense(element) {
    let id = parseInt(element.getAttribute("data-id"));
    let parent = element.parentElement.parentElement.parentElement;
    // remove from dom
    this.expenseList.removeChild(parent);
    this.itemList = this.itemList.filter(el => el.id !== id);
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // new instance of UI
  const ui = new UI();

  // budget forms submit
  budgetForm.addEventListener("submit", function(e) {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  // expense forms
  expenseForm.addEventListener("submit", function(e) {
    e.preventDefault();
    ui.submitExpenseForm();
  });

  // expense click
  expenseList.addEventListener("click", function(e) {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("edit-icon")) {
      // do edit operation
      ui.editExpense(e.target.parentElement);
    } else if (e.target.parentElement.classList.contains("delete-icon")) {
      // remove the expense
      ui.deleteExpense(e.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", eventListeners());
