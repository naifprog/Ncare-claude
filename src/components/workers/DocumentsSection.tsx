"use client";

import { useState } from "react";
import { OutlineIconButton, outlineIconButtonClass } from "@/components/ui/Button";
import { ExportIcon, ImportIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { WorkerDocument } from "@/types";

type DocRow = WorkerDocument & { url?: string };

/**
 * "Important documents" (designs 17, 18, 57, 58, 63): list with view / download / delete,
 * and the "Add document" row (name + file + Save).
 */
export function DocumentsSection({ initial, className }: { initial: WorkerDocument[]; className?: string }) {
  const [documents, setDocuments] = useState<DocRow[]>(initial);
  const [adding, setAdding] = useState(false);
  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  function saveDocument() {
    if (!docName.trim() || !docFile) return;
    const ext = docFile.name.split(".").pop()?.toLowerCase();
    setDocuments((docs) => [
      ...docs,
      {
        id: `doc-${Date.now()}`,
        name: docName.trim(),
        fileName: docFile.name,
        fileType: ext === "pdf" ? "PDF" : ext === "doc" || ext === "docx" ? "Word" : "Image",
        url: URL.createObjectURL(docFile),
      },
    ]);
    setDocName("");
    setDocFile(null);
    setAdding(false);
  }
  return (
      <section className={cn("flex-1 rounded-[5px] bg-page px-4 pb-[30px] pt-[18px] sm:px-[30px]", className)}>
        <div className="flex min-h-11 items-center justify-between gap-4">
          <h2 className="text-xl text-ink">Important documents</h2>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="h-11 w-[190px] rounded-[5px] bg-brand text-lg font-bold text-white shadow-card transition-colors hover:bg-brand/90"
            >
              Add document
            </button>
          )}
        </div>

        <ul className="mt-[17px] space-y-[14px]">
          {adding && (
            <li>
              <form
                className="flex flex-col gap-5 rounded-[5px] bg-card p-5 sm:h-[60px] sm:flex-row sm:items-center sm:px-5 sm:py-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveDocument();
                }}
              >
                <input
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Name"
                  required
                  aria-label="Document name"
                  className="h-11 min-w-0 flex-1 rounded-[5px] bg-page px-[30px] text-base text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
                />
                <label className="flex h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-[5px] bg-page px-[30px] text-base text-ink">
                  <ExportIcon size={20} />
                  <span className="truncate underline">{docFile ? docFile.name : "Upload doc"}</span>
                  <input
                    type="file"
                    required
                    className="sr-only"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 w-[100px] shrink-0 rounded-[5px] bg-brand text-lg font-bold text-white shadow-card disabled:opacity-60"
                >
                  Save
                </button>
              </form>
            </li>
          )}

          {documents.map((doc) => (
            <li
              key={doc.id}
              className="grid h-[60px] grid-cols-[1fr_auto] items-center gap-4 rounded-[5px] bg-card pl-[30px] pr-[30px] text-base text-ink sm:grid-cols-[330px_1fr_auto]"
            >
              <span className="truncate">{doc.name}</span>
              <span className="hidden sm:block">
                {adding ? (
                  <span className="text-brand underline">{doc.fileName}</span>
                ) : (
                  <span className="font-bold text-brand">{doc.fileType}</span>
                )}
              </span>
              <div className="flex items-center gap-2.5">
                {doc.url ? (
                  <>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${doc.name}`}
                      className={outlineIconButtonClass("orange")}
                    >
                      <Icon name="eye" size={18} />
                    </a>
                    <a
                      href={doc.url}
                      download={doc.fileName}
                      aria-label={`Download ${doc.name}`}
                      className={outlineIconButtonClass("purple")}
                    >
                      <ImportIcon size={20} />
                    </a>
                  </>
                ) : (
                  // Mock documents have no file behind them yet.
                  <>
                    <OutlineIconButton tone="orange" aria-label={`View ${doc.name}`} disabled title="No file in demo data" className="disabled:opacity-100">
                      <Icon name="eye" size={18} />
                    </OutlineIconButton>
                    <OutlineIconButton tone="purple" aria-label={`Download ${doc.name}`} disabled title="No file in demo data" className="disabled:opacity-100">
                      <ImportIcon size={20} />
                    </OutlineIconButton>
                  </>
                )}
                <OutlineIconButton
                  tone="negative"
                  aria-label={`Delete ${doc.name}`}
                  onClick={() => setDocuments((docs) => docs.filter((d) => d.id !== doc.id))}
                >
                  <Icon name="trash" size={18} />
                </OutlineIconButton>
              </div>
            </li>
          ))}
          {documents.length === 0 && (
            <li className="rounded-[5px] bg-card px-7 py-6 text-center text-sm text-ink-muted">No documents yet.</li>
          )}
        </ul>
      </section>
  );
}