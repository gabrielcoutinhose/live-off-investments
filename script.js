function calculate() {
  const monthlyValue = parseFloat(
    document.getElementById("monthlyValue").value
  );
  const interestRate =
    parseFloat(document.getElementById("interestRate").value) / 100;
  const desiredReturn = parseFloat(
    document.getElementById("desiredReturn").value
  );
  const inflationRate =
    parseFloat(document.getElementById("inflationRate").value) / 100;

  if (
    isNaN(monthlyValue) ||
    isNaN(interestRate) ||
    isNaN(desiredReturn) ||
    isNaN(inflationRate)
  ) {
    document.getElementById("result").innerHTML =
      "<div class='alert alert-danger'>Please fill in all fields correctly.</div>";
    return;
  }

  let months = 0;
  let accumulatedValue = 0;

  while (accumulatedValue < desiredReturn) {
    accumulatedValue +=
      monthlyValue * (1 + interestRate) - monthlyValue * inflationRate;
    months++;
  }

  document.getElementById("result").innerHTML = `
        <div class="alert alert-success">
             You will need approximately<strong>${months} months</strong> to achieve the desired return.
        </div>
    `;
}
