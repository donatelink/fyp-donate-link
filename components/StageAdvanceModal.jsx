import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

const STAGES = ["Pending", "Confirmed", "Allocated", "Transferred", "Completed"];
const STAGE_DESC = {
  2: "Confirm you have received this donation.",
  3: "You've allocated the funds to a specific cause.",
  4: "Funds have been transferred to the beneficiary.",
  5: "Impact delivered — share the final proof of completion.",
};

export default function StageAdvanceModal({ open, donation, onClose, onAdvanced }) {
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      setNote("");
      setFile(null);
      setSaving(false);
      setErrorMsg("");
    }
  }, [open]);

  if (!open || !donation) return null;

  const nextStage = donation.stage + 1;
  const nextLabel = STAGES[nextStage - 1];

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");

    let proofUrl = null;
    if (file) {
      const ext = (file.name.split(".").pop() || "dat").toLowerCase();
      const path = `${donation.id}/stage${nextStage}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("proofs")
        .upload(path, file, { upsert: false });
      if (upErr) {
        setErrorMsg(`Proof upload failed: ${upErr.message}`);
        setSaving(false);
        return;
      }
      proofUrl = supabase.storage.from("proofs").getPublicUrl(path).data.publicUrl;
    }

    const { error: insErr } = await supabase.from("donation_updates").insert({
      donation_id: donation.id,
      stage: nextStage,
      note: note.trim() || null,
      proof_url: proofUrl,
    });
    if (insErr) {
      setErrorMsg(insErr.message);
      setSaving(false);
      return;
    }

    const { error: stageErr } = await supabase
      .from("donations")
      .update({
        stage: nextStage,
        note: note.trim() || donation.note,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation.id);
    if (stageErr) {
      setErrorMsg(stageErr.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    if (onAdvanced) onAdvanced();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              Advance to Stage {nextStage}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-emerald-700">
            <span className="font-semibold">{nextLabel}</span> — {STAGE_DESC[nextStage]}
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
            Donation: <span className="font-semibold text-zinc-800">${donation.amount}</span> from{" "}
            <span className="font-semibold text-zinc-800">{donation.donor_name}</span>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-zinc-700">
              Update note for the donor
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell the donor what happened at this stage."
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Proof of impact <span className="text-zinc-400">(photo or PDF — optional)</span>
            </label>
            <label className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-300 px-3 py-4 text-sm text-zinc-500 hover:border-emerald-400 hover:bg-emerald-50">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <span className="font-medium text-emerald-700">📎 {file.name}</span>
              ) : (
                <span>📤 Click to upload a receipt, photo, or document</span>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:enabled:border-zinc-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : `Advance to ${nextLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
