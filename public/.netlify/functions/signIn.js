document
  .querySelector(".signinform")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(this);

    // Convert form data to JSON object
    const userData = {};
    formData.forEach((value, key) => {
      userData[key] = value;
    });

    // Send POST request to the server using Axios
    axios
      .post("/api/signIn", userData)
      .then((response) => {
        console.log(response);
        // Check for success message in the response
        if (response.data.message === "Successfully logged in") {
          console.log("True");
          window.location.href = "/panel/campaigns";
        } else {
          console.log("Invalid Email or Password");
        }
      })
      .catch((error) => {
        // Handle error
        if (error.response && error.response.data) {
          console.error("Error:", error.response.data.message);
        } else {
          console.error("Error:", error.message || error);
        }
      });
  });
