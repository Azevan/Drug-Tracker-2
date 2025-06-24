import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseURL = 'https://wnmxpkdkklvjqsqapvin.supabase.co';
const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubXhwa2Rra2x2anFzcWFwdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDI1NTIsImV4cCI6MjA2NjIxODU1Mn0.QBcS2NeKkpUx2D2y_fLx_YkYYuhfCGPOaCPim91SZG8';
export const supabase = createClient(supabaseURL, supKey);

const userEmail = document.getElementById('u-email-dis');
const logoutTombol = document.getElementById('exit-button');
const addDrugF = document.getElementById('tambah-obat-f');
const daftarObatDiv = document.getElementById('daftar-obat');
const pengingatContainer = document.getElementById('pengingat-container');

let currentUser = null;

const setDashboard = async () => {
    const { data: { user }} = await supabase.auth.getUser();

    if (user) {
        currentUser = user;
        userEmail.textContent = user.email;
        ambildantampilkanObat();
        pantauPerubahanObat();
    } else {
        window.location.href = 'index.html'
    }
};

const cekPengingat = (drugs) => {
    pengingatContainer.innerHTML = '';

    const LOW_STOCK_THRESHOLD = 0.10;
    drugs.forEach(drug => {
        const persentaseStok = drug.current_quantity / drug.initial_quantity;
        if (persentaseStok <= LOW_STOCK_THRESHOLD && drug.current_quantity > 0) {
            const pengingatEl = document.createElement('div');
            pengingatEl.classList.add('pengingat', 'stok-rendah');
            pengingatEl.innerHTML = `<strong>Peringatan:</strong> Obat <strong>${drug.drug_name}</strong> Anda hampir habis!`;
            pengingatContainer.appendChild(pengingatEl);
        }
    });
};

const ambildantampilkanObat = async () => {
    if(!currentUser) return;
    const {data: drugs, error} = await supabase
        .from('obat')
        .select('*')
        .eq('user_id',currentUser.id)
        .order('created_at', {ascending: false});
    if (error) {
        console.error('Error mengambil obat: ', error);
        return;
    }
    cekPengingat(drugs);
    daftarObatDiv.innerHTML = '';
    
    if (drugs.length === 0) {
        daftarObatDiv.innerHTML = '<p>Belum ada Obat yang ditambahkan pengguna</p>';
        return;
    }

    drugs.forEach(drug => {
        const obatEl = document.createElement('div');
        obatEl.classList.add('objek-obat');

        obatEl.innerHTML = `
            <div class = "info-obat">
                <h3>${drug.drug_name} <small>(${drug.dose_amount} ${drug.unit} per konsumsi)</small></h3>
                <p>Sisa: <strong>${drug.current_quantity} dari ${drug.initial_quantity} ${drug.unit}</strong></p>
            </div>
            <div class = "kerja-obat">
                <button class="tombol-catatan" data-id="${drug.id}" data-dose="${drug.dose_amount}" data-current="${drug.current_quantity}">Catatan Pemakaian</button>
                <button class = "tombol-hapus" data-id="${drug.id}">Hapus</button>
            </div>
        `;
        daftarObatDiv.appendChild(obatEl);
    });
};

addDrugF.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const obatBaru = {
        user_id: currentUser.id,
        drug_name: addDrugF.querySelector('#namaobat').value,
        dosage_instruction: addDrugF.querySelector('#instruksidosis').value,
        initial_quantity: parseInt(addDrugF.querySelector('#jumlahawal').value),
        current_quantity: parseInt(addDrugF.querySelector('#jumlahawal').value),
        dose_amount: parseInt(addDrugF.querySelector('#jumlahdosis').value),
        unit: addDrugF.querySelector('#uyd').value,
    };

    const {error} = await supabase.from('obat').insert([obatBaru]);
    if (error) {
        console.error('Error menambahkan obat:', error);
        alert('Gagal menambahkan obat. ');
    } else {
        addDrugF.reset();
    }
});

daftarObatDiv.addEventListener('click', async (event) => {

    if (event.target.classList.contains('tombol-hapus')) {
        const drugId = event.target.dataset.id;
        if(confirm('Anda yakin mau menghapus obat ini?')) {
            const {error} = await supabase.from('obat').delete().eq('id', drugId);
            if (error) console.error('Error menghapus obat: ', error);
        }
    }
    
    if (event.target.classList.contains('tombol-catatan')) {
        const drugId = event.target.dataset.id;
        const doseAmount = parseInt(event.target.dataset.dose);
        const currentQuantity = parseInt(event.target.dataset.current);
        if (currentQuantity < doseAmount) {
            alert('Stok tidak cukup untuk pencatatan.');
            return;
        }
        const kuantitasBaru = currentQuantity - doseAmount;
        const {error} = await supabase
            .from('obat')
            .update({current_quantity: kuantitasBaru})
            .eq('id', drugId);
        if (error) console.error('Error dalam pencatatan pemakaian:', error);        
    }
});


const pantauPerubahanObat = () => {
    const channel = supabase
    .channel('public:obat')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'obat'}, payload => {
        console.log('Perubahan database diterima!', payload);
        ambildantampilkanObat();
    })
    .subscribe();
};

logoutTombol.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

setDashboard();

