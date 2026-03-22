fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "userone",
        email: "userone@gmail.com",
        password: "password123",
        username: "userone",
        gender: "Male",
        country: "Belgium",
        dateOfBirth: "2003-12-03"
    })
}).then(async res => {
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
}).catch(console.error);
