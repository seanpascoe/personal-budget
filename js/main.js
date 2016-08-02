$(document).ready(function() {
  var budgetAmount = 0;
  $('#app').hide();

  //handle initial budget submission
  $('#submit').click(function() {
    $('#start').hide();
    var startBudget = $('#cash').val();
    updateBudget(startBudget, "credit");
    $('#app').show();
  });

  //handle 'add' click
  $('#addTrans').click(function(e) {
    e.preventDefault();
    var transName = $('#trans_name').val();
    var transAmount = $('#trans_amount').val();
    var debitEl = document.getElementById('debit_trans');
    var creditEl = document.getElementById('credit_trans');

    if (transName && transAmount && (debitEl.checked || creditEl.checked)) {

      var type = debitEl.checked ? "debit" : "credit";

      console.log(type);

      //add transaction to ledger
      var newEntry = `
      <tr class="${type}">
        <td><span class="thin">${type === "debit" ? "(-)" : "(+)"}</span> ${transName}</td>
        <td class="traxAmount">\$${transAmount}</td>
        <td><i class="remove material-icons">delete_forever</i></td>
      </tr>
      `
      $('#transactions').append(newEntry);

      //cleanup form
      $('#trans_name').val("");
      $('#trans_amount').val("");
      $('#debit_trans').prop('checked', false);
      $('#credit_trans').prop('checked', false);
      Materialize.updateTextFields();

      updateBudget(transAmount, type);
    } else {
      Materialize.toast('You must complete the entire form!', 2000)
    }
  });

  function updateBudget(amount, type) {
    budgetAmount = Number(budgetAmount);
    amount = Number(amount);

    if (type === "debit") {
      budgetAmount -= amount;
      $('#budget').html("$" + budgetAmount);
    } else if (type === "credit") {
      budgetAmount += amount;
      $('#budget').html("$" + budgetAmount);
    }

    if (budgetAmount < 0) {
      $('#budget').css('background-color', '#ffcdd2');
    } else {
      $('#budget').css('background-color', '#c8e6c9');
    }
  }

  //remove transaction from ledger when trash icon is clicked
  $(document).on('click', '.remove', function(e) {
    var trEl = $(e.target).parents('tr')
    var traxType = trEl.attr('class') === "credit" ? "debit" : "credit";
    var traxAmount = trEl.children('.traxAmount').text().replace("$", "");
    updateBudget(traxAmount, traxType);
    trEl.remove();
  })

});
