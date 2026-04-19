import { useState } from 'react';
import './App.css';
import axios from "axios";
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];

    // Invalid file type
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Please upload only Excel (.xlsx, .xls) or CSV files");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        const totalemail = emailList.map(item => item.A).filter(Boolean);

        setEmailList(totalemail);
      } catch (error) {
        console.error(error);
        alert("⚠️ Error reading file. Please upload a valid Excel/CSV file.");
        event.target.value = "";
      }
    };

    reader.onerror = function () {
      alert("⚠️ File reading failed!");
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Send Successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
        }
      })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-600 to-orange-500 animate-gradient bg-[length:300%_300%]"></div>

      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative z-10 w-[90%] md:w-[60%]">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white tracking-wide animate-jump drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] cursor-pointer">
            🚀 BulkMail
          </h1>
          <p className="text-pink-200 mt-2">
            Send emails smarter, faster & beautifully
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white border border-white/20 hover:shadow-pink-500/40 transition duration-500">

          <label className="block mb-2 text-lg font-semibold text-pink-200">
            Email Message
          </label>
          <textarea
            onChange={handlemsg}
            value={msg}
            placeholder="✨ Type your message here..."
            className="w-full h-32 p-4 rounded-xl bg-white/20 border border-white/30 outline-none focus:ring-2 focus:ring-pink-400 transition"
          />

          <div className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-pink-300/40 rounded-xl p-8 hover:bg-white/10 hover:border-pink-400 transition duration-300 cursor-pointer group">
            <input
              type="file" onChange={handlefile} className="cursor-pointer"/>
            <p className="text-pink-200 mt-3 group-hover:scale-110 transition">
              📂 Drag & Drop or Upload CSV
            </p>
          </div>

          <p className="mt-4 text-center text-pink-200">
            📧 Total Emails: <span className="font-bold text-white">{emailList.length}</span>
          </p>

          <div className="flex justify-center">
            <button
              onClick={send}
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-orange-400 hover:to-pink-500 text-white font-semibold shadow-lg transform hover:scale-110 transition duration-300 flex items-center gap-2"
            >
              {status ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                "Send Emails 🚀"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
