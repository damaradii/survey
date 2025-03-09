/*
  BACA SAMPAI AKHIR ISI DOKUMENTASI CLICKUP. !!!!!!!!!!!!!!!!!!!!
  INI CARA MELAKUKAN OPERASI CRUD (CREATE, READ, UPDATE, DELETE) DARI FORM WEBSITE KE CLICKUP 

  Dokumentasi Singkat:
  --------------------
  1. Fungsi-fungsi reusable untuk operasi CRUD TASK CLICKUP :
     - getClickUpTasks(listId, apiToken): Melakukan GET request ke ClickUp untuk mengambil SELURUH task dalam listId. Intinya ambil SEMUA taskname didalam list tersebut.
     - deleteClickUpTask(taskId, apiToken): Menghapus task berdasarkan taskId. Perlu fungsi "getClickUpTasks" agar dapat digunakan.
     - createClickUpTask(listId, apiToken, taskName, description, customFields): Membuat task baru dengan data yang diberikan.
     
  2. Proses pada form submission/Mengirim data dari form ke clickup:
     - Mengambil data input (nama tugas, umur, tanggal lahir, email, gender, minat, dan alamat).
     - Validasi input sederhana.
     - Mengambil daftar task dari ClickUp dan mencari task dengan nama yang sama.
     - Jika ditemukan, task tersebut dihapus.
     - Task baru kemudian dibuat dengan data terbaru.

  Catatan:
  --------
  - Cara mendapatkan listId.
    1. Di clickup klik kanan spaces yang diinginkan dan copy linknya.
    2. Buka browser -> paste linknya -> ambil angka terakhir atau sesudah /li/535353636. 
    Contoh : Saya ingin melakukan operasi CRUD ke list presensi di space Brand /🌟 Event -> presensi.
    link list "presensi" yaitu "https://app.clickup.com/2307700/v/li/901604685240". 
    Ambil bagian akhir setelah /li/. Jadinya list id untuk presensi yaitu "901604685240".
*/

// Cara Generate/ganti APITOKEN. Buka settings akun clickupmu -> Apps -> Click "Generate" -> 👏👏. Aksesnya sama dengan akun tersebut.
// Bila akunnya dapat membuat (CREATE), melihat (READ), UPDATE, dan DELETE task di list tersebut maka APInya juga bisa.
const apiToken = "pk_276677813_5LZTC2L1TYHRVBRRRK5BKXBZDVUU2X7E";
const listId = "901602772763"; // Ganti sesuai kebutuhan

// Fungsi GET: Ambil SELURUH task dari ClickUp pada listId
async function getClickUpTasks(listId, apiToken) {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true`, {
    method: "GET",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil task dari ClickUp.");
  }
  const data = await response.json();
  return data.tasks;
}

// Fungsi DELETE: Hapus task berdasarkan taskId
async function deleteClickUpTask(taskId, apiToken) {
  const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Gagal menghapus task dengan ID: " + taskId);
  }
}

// Fungsi CREATE: Buat task baru dengan data yang diberikan
async function createClickUpTask(listId, apiToken, taskName, description, customFields) {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: taskName,
      description: description,
      custom_fields: customFields,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error("Gagal membuat task: " + (errorData.err || "Kesalahan tidak diketahui"));
  }
  return response.json();
}

async function handleFormSubmit(event) {
  event.preventDefault();

  // Ambil nilai dari input form
  const taskName = document.getElementById("taskName").value.trim();
  const age = document.getElementById("age").value.trim();
  const birthDate = document.getElementById("birthDate").value;
  const email = document.getElementById("email").value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
  const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(
    (input) => input.value
  );
  const address = document.getElementById("address").value.trim();

  // Input tambahan
  const category = document.getElementById("category").value;
  const phone = document.getElementById("phone").value.trim();
  const rating = document.getElementById("rating").value;
  const attachmentInput = document.getElementById("attachment");
  let attachmentName = "";
  if (attachmentInput.files.length > 0) {
    attachmentName = attachmentInput.files[0].name;
  }

  // Validasi input sederhana (sesuaikan jika diperlukan)
  if (!taskName) {
    alert("Nama tugas harus diisi.");
    return;
  }
  if (age === "" || isNaN(age)) {
    alert("Umur harus diisi dengan angka yang valid.");
    return;
  }
  if (!birthDate) {
    alert("Tanggal lahir harus diisi.");
    return;
  }
  if (!validateEmail(email)) {
    alert("Email tidak valid.");
    return;
  }

  // Konversi tanggal lahir ke timestamp
  const birthDateTimestamp = new Date(birthDate).getTime();

  // Mapping data ke custom fields ClickUp (ganti ID sesuai konfigurasi ClickUp Anda)
  const customFields = [
    { id: "8e9befe8-ae88-496f-b80b-fa87c83c2ea1", value: parseInt(age) }, // Umur
    { id: "5b0638e0-fdde-4f7d-b722-fe2500401c7f", value: birthDateTimestamp }, // Tanggal Lahir
    { id: "custom_email_field_id", value: email }, // Email
    { id: "custom_gender_field_id", value: gender }, // Gender
    { id: "custom_interests_field_id", value: interests }, // Minat/Interests
    { id: "custom_address_field_id", value: address }, // Alamat
    { id: "custom_category_field_id", value: category }, // Kategori
    { id: "custom_phone_field_id", value: phone }, // Telepon
    { id: "custom_rating_field_id", value: rating }, // Rating
    { id: "custom_attachment_field_id", value: attachmentName }, // Lampiran (nama file)
  ];

  try {
    // 1. Cek apakah sudah ada task dengan nama yang sama di ClickUp
    const tasks = await getClickUpTasks(listId, apiToken);
    const matchingTasks = tasks.filter((task) => task.name === taskName);

    // 2. Jika ada, hapus task-task tersebut
    for (const task of matchingTasks) {
      await deleteClickUpTask(task.id, apiToken);
    }

    // 3. Buat task baru dengan data terbaru
    await createClickUpTask(listId, apiToken, taskName, "Task dibuat dari form multi-input.", customFields);

    alert("Tugas berhasil dibuat di ClickUp.");
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan. Silakan coba lagi.");
  }
}

// Event listener untuk form submission
const uploadForm = document.getElementById("uploadForm");
// Cek apakah element html dengan id "uploadForm" ada. Bila ada maka masukkan fungsi handleFormSUbmit
if (uploadForm) uploadForm.addEventListener("submit", handleFormSubmit);

/*
CARA UNTUK MENDAPATKAN ID-ID dari custom field di clickup
BACA SAMPAI AKHIR: Dokumentasi Ambil ID Custom Field ClickUp
  -------------------------------------------------------------
Pada integrasi form website dengan ClickUp, Anda perlu mengetahui ID custom field untuk memastikan data yang dikirimkan sesuai dengan field yang diinginkan di ClickUp.
  
Cara Mendapatkan Custom Field IDs:
-----------------------------------
  - Buka browser dan gunakan Developer Tools (tekan F12 atau klik kanan -> Inspect).
  - Buat sebuah button/tombol di halaman HTML dengan id `getClickupData`.
  - Hasil response (dalam bentuk JSON) akan memuat daftar custom field, termasuk ID dan properti lainnya. Lihat hasil di tab Console.
  
*/

// Fungsi untuk mengambil data custom field dari ClickUp
const handleGetClickupIds = async (event) => {
  event.preventDefault();
  const apiToken = "pk_276677813_5LZTC2L1TYHRVBRRRK5BKXBZDVUU2X7E";
  const listId = "900302342659"; // Ganti dengan listId yang sesuai (lihat cara mendapatkan listId)

  console.log("Memulai pengambilan data custom field dari ClickUp...");

  try {
    // Kirim GET request ke endpoint custom field ClickUp
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/field`, {
      method: "GET",
      headers: {
        Authorization: apiToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data custom field.");
    }

    const data = await response.json(); // Data JSON berisi custom field
    console.log("Response dari ClickUp:", data);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};
// Pasang fungsi "handleGetClickupIds" pada button dengan id "getClickupData".
const getClickupData = document.getElementById("getClickupData");
if (getClickupData) getClickupData.addEventListener("click", handleGetClickupIds);

// Fungsi validasi email sederhana
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
