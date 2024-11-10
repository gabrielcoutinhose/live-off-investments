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
       You will need approximately <strong> ${months} months </strong> to achieve the desired return.
  </div>
`;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("financial-form");
  const ctx = document.getElementById("resultChart").getContext("2d");
  let resultChart;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const monthlyValue = parseFloat(
      document.getElementById("monthlyValue").value
    );
    const interestRate =
      parseFloat(document.getElementById("interestRate").value) / 100;
    const desiredMonthlyReturn = parseFloat(
      document.getElementById("desiredMonthlyReturn").value
    );
    const inflationRate =
      parseFloat(document.getElementById("inflationRate").value) / 100;

    const months = Math.ceil(
      desiredMonthlyReturn / (monthlyValue * interestRate)
    );

    const dataLabels = [];
    const dataValues = [];

    for (let i = 1; i <= months; i++) {
      dataLabels.push(`Month ${i}`);
      dataValues.push((monthlyValue * interestRate * i).toFixed(2));
    }

    if (resultChart) {
      resultChart.destroy();
    }

    resultChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dataLabels,
        datasets: [
          {
            label: "Cumulative Return ($)",
            data: dataValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
});

document
  .getElementById("downloadPngBtn")
  .addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = ctx.canvas.toDataURL("image/png");
    link.download = "chart.png";
    link.click();
  });

document
  .getElementById("downloadPdfBtn")
  .addEventListener("click", function () {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const chartImage = ctx.canvas.toDataURL("image/png");
    doc.addImage(chartImage, "PNG", 10, 10, 180, 100);

    doc.text("Financial Graph", 10, 120);

    doc.save("financial_report.pdf");
  });

document
  .getElementById("downloadXlsxBtn")
  .addEventListener("click", function () {
    const monthlyValue = parseFloat(
      document.getElementById("monthlyValue").value
    );
    const interestRate =
      parseFloat(document.getElementById("interestRate").value) / 100;
    const desiredMonthlyReturn = parseFloat(
      document.getElementById("desiredMonthlyReturn").value
    );
    const months = Math.ceil(
      desiredMonthlyReturn / (monthlyValue * interestRate)
    );

    const data = [["Month", "Cumulative Return ($)"]];
    for (let i = 1; i <= months; i++) {
      const cumulativeReturn = (monthlyValue * interestRate * i).toFixed(2);
      data.push([`Month ${i}`, cumulativeReturn]);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Data");

    XLSX.writeFile(wb, "financial_data.xlsx");
  });
