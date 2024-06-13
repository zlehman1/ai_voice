document
  .querySelector(".signupform")
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
      .post("/accounts/sign-up", userData)
      .then((response) => {
        console.log(response.data);
        // Handle successful response
        window.location.href = "/accounts/sign-in";
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error.response.data.message);
      });
  });
