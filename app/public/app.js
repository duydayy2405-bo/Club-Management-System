
const configs = {
  members: {
    title: "Quản lý thành viên",
    fields: [
      ["name", "Họ tên", "text"],
      ["email", "Email", "email"],
      ["phone", "Số điện thoại", "text"],
      ["role", "Vai trò", "text"]
    ]
  },
  activities: {
    title: "Quản lý hoạt động",
    fields: [
      ["title", "Tên hoạt động", "text"],
      ["description", "Mô tả", "text"],
      ["activity_date", "Ngày hoạt động", "date"]
    ]
  },
  contributions: {
    title: "Quản lý đóng góp",
    fields: [
      ["member_id", "Mã thành viên", "number"],
      ["amount", "Số tiền", "number"],
      ["note", "Ghi chú", "text"]
    ]
  },
  meetings: {
    title: "Quản lý lịch họp",
    fields: [
      ["title", "Tên cuộc họp", "text"],
      ["meeting_date", "Ngày giờ họp", "datetime-local"],
      ["location", "Địa điểm", "text"]
    ]
  }
};

let current = "members";
let editingId = null;
let records = [];

const menu = document.getElementById("menu");
const form = document.getElementById("form");
const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");
const message = document.getElementById("message");

Object.keys(configs).forEach(key => {
  const button = document.createElement("button");
  button.textContent = configs[key].title;
  button.onclick = () => {
    current = key;
    editingId = null;
    render();
  };
  button.dataset.key = key;
  menu.appendChild(button);
});

function showMessage(text) {
  message.textContent = text;
}

function renderForm() {
  form.replaceChildren();

  configs[current].fields.forEach(([key, label, type]) => {
    const input = document.createElement("input");
    input.name = key;
    input.type = type;
    input.placeholder = label;
    input.required = key !== "description" &&
                     key !== "note" &&
                     key !== "phone";
    if (key === "amount") input.min = "0";
    form.appendChild(input);
  });

  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Lưu thông tin";
  form.appendChild(save);

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Hủy";
  cancel.onclick = () => {
    editingId = null;
    form.reset();
  };
  form.appendChild(cancel);
}

async function loadData() {
  try {
    const response = await fetch("/api/" + current);
    if (!response.ok) throw new Error("Lỗi tải dữ liệu");
    records = await response.json();
    renderTable();
  } catch (err) {
    showMessage(err.message);
  }
}

function renderTable() {
  thead.replaceChildren();
  tbody.replaceChildren();

  const headerRow = document.createElement("tr");
  ["ID", ...configs[current].fields.map(f => f[1]), "Thao tác"]
    .forEach(label => {
      const th = document.createElement("th");
      th.textContent = label;
      headerRow.appendChild(th);
    });
  thead.appendChild(headerRow);

  records.forEach(record => {
    const row = document.createElement("tr");

    [record.id, ...configs[current].fields.map(f => record[f[0]])]
      .forEach(value => {
        const td = document.createElement("td");
        td.textContent = value == null ? "" : String(value);
        row.appendChild(td);
      });

    const actions = document.createElement("td");
    actions.className = "actions";

    const edit = document.createElement("button");
    edit.textContent = "Sửa";
    edit.className = "edit";
    edit.onclick = () => editRecord(record);

    const del = document.createElement("button");
    del.textContent = "Xóa";
    del.className = "delete";
    del.onclick = () => deleteRecord(record.id);

    actions.append(edit, del);
    row.appendChild(actions);
    tbody.appendChild(row);
  });
}

function editRecord(record) {
  editingId = record.id;

  configs[current].fields.forEach(([key, label, type]) => {
    let value = record[key] ?? "";

    if (type === "date" && value)
      value = String(value).slice(0, 10);

    if (type === "datetime-local" && value)
      value = String(value).replace(" ", "T").slice(0, 16);

    form.elements[key].value = value;
  });

  showMessage("Đang sửa bản ghi ID: " + editingId);
  window.scrollTo(0, 0);
}

async function deleteRecord(id) {
  if (!confirm("Bạn có chắc muốn xóa bản ghi này?")) return;

  try {
    const response = await fetch("/api/" + current + "/" + id, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Không thể xóa dữ liệu");
    showMessage("Đã gửi yêu cầu xóa");
    await loadData();
  } catch (err) {
    showMessage(err.message);
  }
}

form.onsubmit = async event => {
  event.preventDefault();

  const data = {};
  configs[current].fields.forEach(([key]) => {
    data[key] = form.elements[key].value || null;
  });

  try {
    const url = "/api/" + current +
                (editingId ? "/" + editingId : "");

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Không thể lưu dữ liệu");

    editingId = null;
    form.reset();
    showMessage("Lưu thông tin thành công!");
    await loadData();
  } catch (err) {
    showMessage(err.message);
  }
};

function render() {
  document.getElementById("heading").textContent =
    configs[current].title;

  document.querySelectorAll("#menu button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.key === current);
  });

  showMessage("");
  renderForm();
  loadData();
}

render();
