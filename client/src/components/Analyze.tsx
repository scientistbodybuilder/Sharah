import { useRef, useState, type ReactNode } from "react";
import {
  FileText,
  FolderOpen,
  ScanLine,
  ShieldCheck,
  Upload,
  WalletCards,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import { Button } from "./ui/button";
import { uploadFile, hashFile } from '../services/uploadServices'
import ClauseBreakdown from './analyze/ClauseBreakdown'
import RecentUploadSheet from './analyze/RecentUploadSheet'
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ClauseCardProps } from './analyze/ClauseCard'

interface ErrorTypes {
  file?: string
  analyze?: string
}




const Analyze = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [displayFileName, setDisplayFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorTypes>({});
  // const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ClauseCardProps[]>>({});
  const [existingCachedData, setExistingCachedData] = useState<Record<string, ClauseCardProps[]> | null>(null);
  const queryClient = useQueryClient();
  const handleFile = (file?: File) => {
    if (file && file.type === 'application/pdf') {
      console.log('File selected:', file);
      setFileName(file.name);
      setSelectedFile(file);
      //  check whether the same file is already cached
      const hash = hashFile(file,false);
      console.log('cache hash:', hash);
      const cachedData = queryClient.getQueryData(['analysis', hash]);
      console.log('cached data:', cachedData);
      if (cachedData) {
          setExistingCachedData(cachedData as Record<string, ClauseCardProps[]>);
          // setFileName(file.name);
          // setSelectedFile(file);
          // return;
      }

      
    } else {
      setErrors({ ...errors, file: "Please upload a valid PDF file." });
    }
  };

  const { mutate: analyzeFile, isPending } = useMutation({
      mutationFn: (file: File) => uploadFile(file, !!existingCachedData),
      onSuccess: (data) => {
          console.log('analyze result:', data)
          setResults(data.data)
          setDisplayFileName(fileName)
          queryClient.setQueryData(['analysis', data.hash], data.data)
          setSelectedFile(null)
          setFileName("")
      },
      onError: (err) => {
          console.error('Error uploading file:', err)
          setErrors({ ...errors, analyze: "Error analyzing file." })
      },
  })

  const handleAnalyze = () => {
      if (selectedFile) {
        // 
        analyzeFile(selectedFile)
        setExistingCachedData(null) // reset
      }
  }

  const retrieveExistingCache = () => {
    if (existingCachedData) {
      setSelectedFile(null)
      setResults(existingCachedData);
      setExistingCachedData(null) // reset
    }
  }

  return (
    <main className="analyze-page min-h-[calc(100dvh-52px-140px)] grow flex flex-col items-center justify-start gap-4">
      <div className="w-full flex justify-start m-0 cursor-pointer">
        <RecentUploadSheet setResults={setResults} setFileName={setDisplayFileName} />
      </div>
      
      <section className="audit-panel gap-2" aria-labelledby="upload-heading">
        <div className="panel-intro py-2 flex flex-col items-start sm:flex-row sm:items-center">
          
          <div className="intro-copy flex items-center gap-2">
            <div className="document-icon">
                <FileText />
            </div>
            <div className="title-line">
              <h1 id="upload-heading">Upload Student Loan Agreement</h1>
              {/* <span className="step-pill">Step 1 of 2</span> */}
            </div>
          </div>

          <div className="privacy-pill gap-2">
            <ShieldCheck /> Zero Data Retention • End-to-End Encrypted
          </div>
        </div>
        <div
          className="drop-zone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFile(event.dataTransfer.files[0]);
          }}
        >
          <div className="upload-icon">
            <Upload />
          </div>
          <h2>
            {fileName || (
              <>
                Drag &amp; drop your loan agreement here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse files
                </button>
              </>
            )}
          </h2>
          {fileName && (
            <button
              className="change-file"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose a different file
            </button>
          )}
          <p>
            Upload your Master Promissory Note (MPN), Private Student Loan
            <br className="desktop-break" /> Disclosures, or Income-Share
            Agreement (ISA).
          </p>
          <div className="format-list">
            <span>
              <FileText /> PDF format only
            </span>
            <span>
              <WalletCards /> Up to 30 MB
            </span>
            <span>
              <ScanLine /> Multi-page OCR supported
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
          {errors?.file && <p className="text-(--non-compliant) text-xs text-center">{errors.file}.</p>}

        {existingCachedData && <p className="text-muted-foreground text-xs text-center">
          Cached data found for this file. Click <span onClick={() => retrieveExistingCache()} className="text-(--accent-color) hover:text-(--accent-light) hover:underline cursor-pointer">here</span> to retrieve. Otherwise, click "Analyze" to re-analyze.
        </p>}

        <Button onClick={() => handleAnalyze()} disabled={selectedFile === null || isPending} className='bg-(--accent-color) w-full rounded-md cursor-pointer hover:bg-(--accent-color)/90'>
            { isPending ? <Spinner /> : "Analyze" }
        </Button>

        <div className="feature-grid">
          <Feature icon={<ShieldCheck />} title="AAOIFI Shariah Standards">
            Evaluates Documents against Shariah Standards No. 19 &amp; 31.
          </Feature>
          <Feature icon={<ScanLine />} title="Instant Clause Breakdown">
            Processes agreements in under 30 seconds, flagging prohibited,
            conditional, and permissible terms.
          </Feature>
          <Feature icon={<FolderOpen />} title="Exportable Scholarly Memo">
            Generates a PDF report with traceable citations to specific AAOIFI Shariah Standards.
          </Feature>
        </div>
      </section>

      {displayFileName != "" && Object.keys(results).length > 0 && (
        <ClauseBreakdown data={results} file={displayFileName} />
      )}
    </main>
  );
};

function Feature({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="feature-item">
      <div className="feature-icon flex items-center justify-center p-1">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default Analyze;
