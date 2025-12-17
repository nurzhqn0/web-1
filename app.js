const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/calculate-bmi", (req, res) => {
  try {
    const { weight, height } = req.body;

    if (!weight || !height) {
      return res.status(400).json({
        error: "Please provide both weight and height.",
      });
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      return res.status(400).json({
        error: "Weight and height must be valid numbers.",
      });
    }

    if (weightNum <= 0 || heightNum <= 0) {
      return res.status(400).json({
        error: "Weight and height must be positive numbers.",
      });
    }

    if (heightNum > 3) {
      return res.status(400).json({
        error: "Height seems too large. Please enter height in meters.",
      });
    }

    const bmi = (weightNum / (heightNum * heightNum)).toFixed(1);

    // category
    let category, categoryClass, message;

    if (bmi < 18.5) {
      category = "Underweight";
      categoryClass = "underweight";
      message =
        "You may need to gain weight. Consult with a healthcare provider for personalized advice.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal Weight";
      categoryClass = "normal";
      message =
        "You have a healthy weight. Keep up the good work with a balanced diet and regular exercise!";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      categoryClass = "overweight";
      message =
        "You may want to consider a healthier diet and more physical activity. Consult a healthcare provider.";
    } else {
      category = "Obese";
      categoryClass = "obese";
      message =
        "Your health may be at risk. Please consult with a healthcare provider for guidance.";
    }

    // send response
    res.json({
      bmi: bmi,
      category: category,
      categoryClass: categoryClass,
      message: message,
    });
  } catch (error) {
    console.error("Error calculating BMI:", error);
    res.status(500).json({
      error: "An error occurred while calculating BMI.",
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// run app
app.listen(PORT, () => {
  console.log(`BMI Calculator server running on http://localhost:${PORT}`);
});
