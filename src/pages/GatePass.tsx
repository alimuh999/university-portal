import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Plus, Printer, CheckCircle2, Clock, Send } from "lucide-react";
import { getGatePasses, addGatePass } from "../lib/storage";
import type { GatePass } from "../lib/data";

export default function GatePassPage() {
  const { student } = useAuth();
  const [passes, setPasses] = useState<GatePass[]>(() =>
    student ? getGatePasses(student.rollNumber) : []
  );
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    purpose: "",
    destination: "",
    departureTime: "",
    returnTime: "",
    date: new Date().toISOString().split("T")[0],
  });

  if (!student) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newPass = addGatePass(student.rollNumber, form);
      setPasses(getGatePasses(student.rollNumber));
      setForm({ purpose: "", destination: "", departureTime: "", returnTime: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 4000);
    }, 700);
  };

  const handlePrint = (gatePass: GatePass) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gate Pass - ${student.rollNumber}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
          .border-pass { border: 3px solid #1e3a8a; padding: 25px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { color: #1e3a8a; font-size: 22px; }
          h2 { font-size: 16px; color: #374151; letter-spacing: 3px; margin-top: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
          .label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
          .value { font-size: 14px; font-weight: 600; }
          .purpose-box { border: 1px solid #d1d5db; padding: 12px; border-radius: 4px; margin-bottom: 20px; }
          .sign-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; }
          .sign-box { border-top: 1px solid #d1d5db; padding-top: 8px; text-align: center; }
          .sign-label { font-size: 11px; color: #6b7280; }
          .pass-id { text-align: center; color: #9ca3af; font-size: 11px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="border-pass">
          <div class="header">
            <h1>University Portal</h1>
            <h2>GATE PASS</h2>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Student Name</div>
              <div class="value">${student.name}</div>
            </div>
            <div class="info-item">
              <div class="label">Roll Number</div>
              <div class="value">${student.rollNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Department</div>
              <div class="value">${student.department}</div>
            </div>
            <div class="info-item">
              <div class="label">Program</div>
              <div class="value">${student.program}</div>
            </div>
            <div class="info-item">
              <div class="label">Date</div>
              <div class="value">${gatePass.date}</div>
            </div>
            <div class="info-item">
              <div class="label">Destination</div>
              <div class="value">${gatePass.destination}</div>
            </div>
            <div class="info-item">
              <div class="label">Departure Time</div>
              <div class="value">${gatePass.departureTime}</div>
            </div>
            <div class="info-item">
              <div class="label">Return Time</div>
              <div class="value">${gatePass.returnTime}</div>
            </div>
          </div>
          <div class="purpose-box">
            <div class="label">Purpose of Going Out</div>
            <p style="margin-top:5px;font-size:13px;">${gatePass.purpose}</p>
          </div>
          <div class="sign-row">
            <div class="sign-box"><div class="sign-label">Student Signature</div></div>
            <div class="sign-box"><div class="sign-label">Class Teacher</div></div>
            <div class="sign-box"><div class="sign-label">Security Officer</div></div>
          </div>
          <div class="pass-id">Gate Pass ID: ${gatePass.id} | Generated: ${new Date().toLocaleString("en-PK")}</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
  };

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gate Pass</h1>
          <p className="text-muted-foreground text-sm mt-1">Request a gate pass to leave the university premises</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Gate Pass
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <p className="text-sm font-medium text-emerald-600">Gate pass generated. Print it and show to the security officer.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">New Gate Pass Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Home, Hospital, Market"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Departure Time</label>
                <input
                  type="time"
                  name="departureTime"
                  value={form.departureTime}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Expected Return Time</label>
                <input
                  type="time"
                  name="returnTime"
                  value={form.returnTime}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Purpose of Visit</label>
              <textarea
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="State the reason for leaving university premises..."
                rows={3}
                className={inputClass + " resize-none"}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Generate Gate Pass
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Gate Passes ({passes.length})</h2>
        {passes.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <GraduationCap size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No gate passes yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Click "New Gate Pass" to generate one</p>
          </div>
        ) : (
          passes.map((pass) => (
            <div key={pass.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground">#{pass.id}</span>
                    <span className="text-xs text-muted-foreground">—</span>
                    <span className="text-xs text-muted-foreground">{pass.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{pass.destination}</p>
                  <p className="text-sm text-muted-foreground mb-2">{pass.purpose}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Departure: <strong>{pass.departureTime}</strong></span>
                    <span>Return: <strong>{pass.returnTime}</strong></span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-500/15 text-amber-600 border-amber-500/20">
                    <Clock size={11} />
                    Pending
                  </span>
                  <button
                    onClick={() => handlePrint(pass)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Printer size={12} />
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
