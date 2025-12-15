const form = document.getElementById("bmiForm");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");
const resultBox = document.getElementById("resultBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  resultDiv.style.display = "none";
  errorDiv.style.display = "none";
  errorDiv.classList.remove("show");

  if (!weight || !height) {
    showError("Please enter both weight and height.");
    return;
  }

  if (weight <= 0 || height <= 0) {
    showError("Weight and height must be positive numbers.");
    return;
  }

  if (height > 3) {
    showError(
      "Height seems too large. Please enter height in meters (e.g., 1.75)."
    );
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/calculate-bmi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weight, height }),
    });

    const data = await response.json();

    if (response.ok) {
      displayResult(data);
    } else {
      showError(data.error || "An error occurred while calculating BMI.");
    }
  } catch (error) {
    showError("Unable to connect to server. Please try again.");
    console.error("Error:", error);
  }
});

function displayResult(data) {
  // update
  document.getElementById("bmiValue").textContent = data.bmi;
  document.getElementById("bmiCategory").textContent = data.category;
  document.getElementById("resultMessage").textContent = data.message;

  resultBox.className = "alert text-center py-4";

  // bootstrap classes
  let alertClass, iconClass;

  if (data.categoryClass === "underweight") {
    alertClass = "alert-warning";
    iconClass = "text-warning";
  } else if (data.categoryClass === "normal") {
    alertClass = "alert-success";
    iconClass = "text-success";
  } else if (data.categoryClass === "overweight") {
    alertClass = "alert-orange";
    iconClass = "text-orange";
  } else if (data.categoryClass === "obese") {
    alertClass = "alert-danger";
    iconClass = "text-danger";
  }

  resultBox.classList.add(alertClass);

  const icon = document.getElementById("resultIcon");
  icon.className = `bi bi-check-circle-fill display-1 ${iconClass}`;

  resultDiv.style.display = "block";
  resultDiv.classList.add("fade-in");

  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showError(message) {
  document.getElementById("errorMessage").textContent = message;
  errorDiv.style.display = "block";
  errorDiv.classList.add("show");
  errorDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// reset animation
resultDiv.addEventListener("animationend", () => {
  resultDiv.classList.remove("fade-in");
});
