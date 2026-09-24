import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { 
  hashFile 
} from '../hooks/useAnalyzeFile'
import ClauseBreakdown from './analyze/ClauseBreakdown'
import RecentUploadSheet from './analyze/RecentUploadSheet'
import { useQueryClient } from "@tanstack/react-query"

import type { ClauseCardProps } from './analyze/ClauseCard'
import useAnalyzeFile from "@/hooks/useAnalyzeFile";
import { useUser } from '@/context'
// interface ErrorTypes {
//   file?: string
//   analyze?: string
// }




const Analyze = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [displayFileName, setDisplayFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingCachedData, setExistingCachedData] = useState<Record<string, ClauseCardProps[]> | null>(null);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const [analyze, setAnalyze] = useState(false);
  const [results, setResults] = useState<Record<string, ClauseCardProps[]>>({});
  const { user, updateCredits } = useUser();
  const { done, loading, error } = useAnalyzeFile(selectedFile, !!existingCachedData, user?.uid || '', analyze, setResults, updateCredits);
  // const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleFile = (file?: File) => {
    if (file && file.type === 'application/pdf') {
      console.log('File selected:', file);
      setFileName(file.name);
      setSelectedFile(file);
      //  check whether the same file is already cached
      const hash = hashFile(file,false, user?.uid || '');
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
      setFileTypeError("Please upload a valid PDF file.");
    }
  };

  // const { mutate: analyzeFile, isPending } = useMutation({
  //     mutationFn: (file: File) => uploadFile(file, !!existingCachedData),
  //     onSuccess: (data) => {
  //         console.log('analyze result:', data)
  //         setResults(data.data)
  //         setDisplayFileName(fileName)
  //         queryClient.setQueryData(['analysis', data.hash], data.data)
  //         setSelectedFile(null)
  //         setFileName("")
  //     },
  //     onError: (err) => {
  //         console.error('Error uploading file:', err)
  //         setErrors({ ...errors, analyze: "Error analyzing file." })
  //     },
  // })

  useEffect(() => {
    if (done) {
      setAnalyze(false)
    }
  }, [done])

  const handleAnalyze = () => {
      if (selectedFile) {
        // 
        setAnalyze(true)
        setDisplayFileName(selectedFile.name)

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
          {fileTypeError && <p className="text-(--non-compliant) text-xs text-center">{fileTypeError}.</p>}

        {existingCachedData && <p className="text-muted-foreground text-xs text-center">
          Cached data found for this file. Click <span onClick={() => retrieveExistingCache()} className="text-(--accent-color) hover:text-(--accent-light) hover:underline cursor-pointer">here</span> to retrieve. Otherwise, click "Analyze" to re-analyze.
        </p>}

        <Button onClick={() => handleAnalyze()} disabled={selectedFile === null || loading || user?.credits === 0} className='bg-(--accent-color) w-full rounded-md cursor-pointer hover:bg-(--accent-color)/90'>
            { loading ? <Spinner /> : "Analyze" }
        </Button>

        <div className="feature-grid">
          <Feature icon={<ShieldCheck />} title="AAOIFI Shariah Standards">
            Evaluates Documents against Shariah Standards No. 19 &amp; 31.
          </Feature>
          <Feature icon={<ScanLine />} title="Instant Clause Breakdown">
            Processes agreements in real-time, flagging prohibited,
            conditional, and permissible terms.
          </Feature>
          <Feature icon={<FolderOpen />} title="Exportable Scholarly Memo">
            Generates a PDF report with traceable citations to specific AAOIFI Shariah Standards.
          </Feature>
        </div>
      </section>

      {displayFileName != "" && results != null && Object.keys(results).length > 0 && (
        <ClauseBreakdown data={results} file={displayFileName} loading={loading} error={error} />
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
