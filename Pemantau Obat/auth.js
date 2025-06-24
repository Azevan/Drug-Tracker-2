import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseURL = 'https://wnmxpkdkklvjqsqapvin.supabase.co';
const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubXhwa2Rra2x2anFzcWFwdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDI1NTIsImV4cCI6MjA2NjIxODU1Mn0.QBcS2NeKkpUx2D2y_fLx_YkYYuhfCGPOaCPim91SZG8';
export const supabase = createClient(supabaseURL, supKey);
document.addEventListener('DOMContentLoaded', () => {
    const logForm = document.querySelector('#login-page form')
    const signForm = document.querySelector('#sign-page form')
    const shSign = document.getElementById('show-sign')
    const shLogin = document.getElementById('show-login')
    const logContainer = document.getElementById('login-page')
    const signContainer = document.getElementById('sign-page')

    shSign.addEventListener('click', (event) => {
        event.preventDefault();
        logContainer.style.display = 'none';
        signContainer.style.display = 'block';
    });
    shLogin.addEventListener('click', (event) => {
        event.preventDefault();
        signContainer.style.display = 'none';
        logContainer.style.display = 'block';
    });

    signForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = signForm.querySelector('#sign-mail').value;
        const password = signForm.querySelector('#sign-pass').value;
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            alert('Error dalam pembuatan akun: ' + error.message);
        } else {
            alert('Akun berhasil dibuat, anda dapat mengecek email anda untuk mengonfirmasi');
        }
    });

    logForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = logForm.querySelector('#login-mail').value;
        const password = logForm.querySelector('#login-pass').value;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            alert('Error dalam percobaan masuk: ' + error.message);
        } 
    });
});

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('Pengguna sukses masuk. Memasukkan pengguna ke dashboard...');
        window.location.href = 'dashboard.html';

    }
});