import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        window.location.href = 'home.html'; // Redirect to home page
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});







/*import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase-config";

const auth = getAuth(app);

export function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}*/
