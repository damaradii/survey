// Cara Generate/ganti APITOKEN. Buka settings akun clickupmu -> Apps -> Click "Generate" -> 👏👏. Aksesnya sama dengan akun tersebut.
// Bila akunnya dapat membuat (CREATE), melihat (READ), UPDATE, dan DELETE task di list tersebut maka APInya juga bisa.

// Fungsi GET: Ambil SELURUH task dari ClickUp pada listId
const apiToken = "pk_276677813_5LZTC2L1TYHRVBRRRK5BKXBZDVUU2X7E";
const listId = "901604685240"; // Ganti sesuai kebutuhan
const handleGetClickupIds = async (event) => {
  event.preventDefault();
  console.log("Memulai pengambilan data custom field dari ClickUp...");

  try {
    // Kirim GET request ke endpoint custom field ClickUp
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/field`,
      {
        method: "GET",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data custom field.");
    }

    const data = await response.json(); // Data JSON berisi custom field
    console.log("Response dari ClickUp:", data);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

const getClickUpdata = document.getElementById("getClickUpData");
if (getClickUpdata)
  getClickUpdata.addEventListener("click", handleGetClickupIds);
async function getClickUpTasks(listId, apiToken) {
  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true`,
      {
        method: "GET",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error(
        "Gagal mengambil task dari ClickUp. Status:",
        response.status
      );
      throw new Error("Gagal mengambil task dari ClickUp.");
    }
    const data = await response.json();
    console.log("Task berhasil diambil:", data.tasks.length, "task ditemukan");
    return data.tasks;
  } catch (error) {
    console.error("Error saat mengambil task:", error);
    throw error;
  }
}

// Fungsi DELETE: Hapus task berdasarkan taskId
async function deleteClickUpTask(taskId, apiToken) {
  console.log("Menghapus task dengan ID:", taskId);
  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("Gagal menghapus task. Status:", response.status);
      throw new Error("Gagal menghapus task dengan ID: " + taskId);
    }
    console.log("Task berhasil dihapus:", taskId);
  } catch (error) {
    console.error("Error saat menghapus task:", error);
    throw error;
  }
}

// Fungsi CREATE: Buat task baru dengan data yang diberikan
async function createClickUpTask(
  listId,
  apiToken,
  taskName,
  description,
  customFields
) {
  console.log("Membuat task baru:", taskName);
  console.log("Data yang akan dikirim:", {
    name: taskName,
    description: description,
    custom_fields: customFields,
  });

  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      {
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
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gagal membuat task. Response:", errorData);
      throw new Error(
        "Gagal membuat task: " + (errorData.err || "Kesalahan tidak diketahui")
      );
    }

    const result = await response.json();
    console.log("Task berhasil dibuat:", result);
    return result;
  } catch (error) {
    console.error("Error saat membuat task:", error);
    throw error;
  }
}

// Fungsi untuk mengambil data custom field dari ClickUp
async function getClickUpCustomFields(listId, apiToken) {
  console.log("Mengambil data custom field dari ClickUp...");
  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/field`,
      {
        method: "GET",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response status custom fields:", response.status);

    if (!response.ok) {
      console.error(
        "Gagal mengambil data custom field. Status:",
        response.status
      );
      throw new Error("Gagal mengambil data custom field.");
    }

    const data = await response.json();
    console.log("Custom fields berhasil diambil:", data);
    return data.fields;
  } catch (error) {
    console.error("Error saat mengambil custom fields:", error);
    throw error;
  }
}

function showCustomAlert(message) {
  // Cek apakah alert sudah ada, jika ada hapus dulu
  let existingAlert = document.getElementById("customAlert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Buat elemen div untuk alert
  let alertBox = document.createElement("div");
  alertBox.id = "customAlert";
  alertBox.innerText = message;

  // Gaya CSS langsung di JavaScript
  alertBox.style.position = "fixed";
  alertBox.style.top = "20px";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translateX(-50%)";
  alertBox.style.backgroundColor = "#4CAF50";
  alertBox.style.color = "white";
  alertBox.style.padding = "15px 25px";
  alertBox.style.borderRadius = "5px";
  alertBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  alertBox.style.zIndex = "1000";
  alertBox.style.fontSize = "16px";
  alertBox.style.fontWeight = "bold";
  alertBox.style.textAlign = "center";
  alertBox.style.opacity = "1";
  alertBox.style.transition = "opacity 0.5s ease-in-out";

  // Tambahkan ke body
  document.body.appendChild(alertBox);

  // Hapus alert setelah beberapa detik
  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => {
      alertBox.remove();
    }, 500); // Waktu transisi harus sama dengan waktu opacity
  }, 3000);
}

// Fungsi untuk menangani submit form
async function handleFormSubmit(event) {
  event.preventDefault();
  console.log("Form submit dimulai...");

  // Ambil nilai dari input form
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  let nomorWhatsApp = document.getElementById("nomorWhatsApp").value.trim();
  const judul = document.getElementById("judul").value.trim();
  const kehadiran =
    document.querySelector('input[name="kehadiran"]:checked')?.value || "";
  const sosialMedia = Array.from(
    document.querySelectorAll('input[name="sosialMedia"]:checked')
  ).map((input) => input.value);

  // Format nomor WhatsApp dengan menambahkan kode negara +62 jika belum ada
  if (nomorWhatsApp.startsWith("0")) {
    nomorWhatsApp = "+62" + nomorWhatsApp.substring(1);
  } else if (!nomorWhatsApp.startsWith("+")) {
    nomorWhatsApp = "+62" + nomorWhatsApp;
  }

  // Convert sosialMedia array to string
  const sosialMediaString = sosialMedia.join(", ");

  console.log("Data form:", {
    nama,
    email,
    nomorWhatsApp,
    judul,
    kehadiran,
    sosialMediaString,
  });

  // Validasi input sederhana
  if (!nama) {
    alert("Nama harus diisi.");
    return;
  }
  if (!email || !validateEmail(email)) {
    alert("Email tidak valid.");
    return;
  }
  if (!nomorWhatsApp || isNaN(nomorWhatsApp.replace("+", ""))) {
    alert("Nomor WhatsApp harus diisi dengan angka yang valid.");
    return;
  }
  if (!judul) {
    alert("Judul Webinar harus diisi.");
    return;
  }
  if (!kehadiran) {
    alert("Silakan pilih status kehadiran Anda.");
    return;
  }

  // Mapping data ke custom fields ClickUp
  const customFields = [
    { id: "8c91cce3-c9ab-4be6-a2e4-fabd373bdafd", value: email },
    { id: "50dbfb39-a980-4b49-80c7-70a6f1f154b8", value: judul },
    { id: "8f694fdf-bc60-4f1c-aba5-1e595f95ad69", value: nomorWhatsApp },
    { id: "b18aa038-7bac-4287-8264-72c4cd65ff39", value: kehadiran },
    { id: "c1f564e7-d03f-4f5d-aad6-83661c93b37c", value: sosialMediaString },
  ];

  try {
    // 1. Cek apakah sudah ada task dengan nama yang sama di ClickUp
    const tasks = await getClickUpTasks(listId, apiToken);
    const matchingTasks = tasks.filter((task) => task.name === `${nama}`);

    // 2. Jika ada, hapus task-task tersebut
    for (const task of matchingTasks) {
      await deleteClickUpTask(task.id, apiToken);
    }

    // 3. Buat task baru dengan data form
    await createClickUpTask(
      listId,
      apiToken,
      nama,
      "Presensi Peluang Sukses Kerja Di Jepang",
      customFields
    );

    showCustomAlert("Presensi berhasil dikirim ke ClickUp!");
    document.getElementById("presensiForm").reset();
  } catch (error) {
    console.error("DATA GAGAL TERKIRIM KE CLICKUP!");
    console.error("Error detail:", error);
    alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
  }
}

// Fungsi validasi email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Event listener untuk form submission
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, mencari form presensi...");
  const presensiForm = document.getElementById("presensiForm");
  if (presensiForm) {
    console.log("Form presensi ditemukan, memasang event listener...");
    presensiForm.addEventListener("submit", handleFormSubmit);
    console.log("Event listener berhasil dipasang");
  } else {
    console.error("Form presensi tidak ditemukan di halaman!");
  }
});

// Log info saat script pertama kali dimuat
console.log("Script ClickUp terintegrasi dimuat");
