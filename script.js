document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK not loaded. Check your script order in index.html.");
    } else {
        console.log("✅ Firebase SDK loaded successfully.");

        // ✅ Initialize Firebase Auth & Database
        const auth = firebase.auth();
        const db = firebase.database();
        console.log("✅ Firebase Auth and Database initialized.");

        // DOM Elements
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const signUpBtn = document.getElementById('signUpBtn');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const habitList = document.getElementById('habits');
        const habitInput = document.getElementById('habitInput');
        const habitForm = document.getElementById('habitForm');
        const addHabitBtn = document.getElementById('addHabitBtn');

        console.log("Script loaded successfully.");

        // Sign Up
        signUpBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            console.log("Sign-up attempt with email:", email);

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log("User signed up:", userCredential.user);
                    alert('User signed up!');
                })
                .catch(error => {
                    console.error("Sign-up error:", error);
                    alert(error.message);
                });
        });

        // Login
        loginBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            console.log("Login attempt with email:", email);

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log("User logged in:", userCredential.user);
                    alert('Logged in successfully!');
                    habitForm.style.display = 'block';
                    logoutBtn.style.display = 'block';
                })
                .catch(error => {
                    console.error("Login error:", error);
                    alert(error.message);
                });
        });

        // Logout
        logoutBtn.addEventListener('click', () => {
            console.log("Logout attempt.");
            auth.signOut().then(() => {
                console.log("User logged out.");
                alert('Logged out');
                habitForm.style.display = 'none';
                logoutBtn.style.display = 'none';
            });
        });

        // Track authentication state
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log("User is logged in:", user);
                habitForm.style.display = 'block';
                logoutBtn.style.display = 'block';
            } else {
                console.log("No user is logged in.");
                habitForm.style.display = 'none';
                logoutBtn.style.display = 'none';
            }
        });

        // Display habits from Firebase
        function loadHabits() {
            db.ref('habits').on('value', (snapshot) => {
                habitList.innerHTML = '';
                snapshot.forEach((childSnapshot) => {
                    const habit = childSnapshot.val();
                    const li = document.createElement('li');
                    li.textContent = habit.name;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '❌';
                    deleteBtn.addEventListener('click', () => {
                        console.log("Deleting habit:", habit.name);
                        db.ref('habits/' + childSnapshot.key).remove();
                    });
                    
                    li.appendChild(deleteBtn);
                    habitList.appendChild(li);
                });
            });
        }

        // Add new habit
        addHabitBtn.addEventListener('click', () => {
            const habit = habitInput.value.trim();
            if (habit) {
                console.log("Adding habit:", habit);
                db.ref('habits').push({ name: habit });
                habitInput.value = '';
            }
        });

        // Load habits on startup
        loadHabits();
    }
});
