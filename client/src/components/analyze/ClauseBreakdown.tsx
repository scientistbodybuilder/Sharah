import {
  Pagination,
  PaginationContent,
//   PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useMemo, useState } from 'react'
import ClauseCard from "./ClauseCard"
import { Download } from "lucide-react";
import type {ClauseCardProps} from './ClauseCard'
import { Button } from "../ui/button";
import { buildReport } from '../../services/pdfServices'



const ClauseBreakdown = ({ data, file, loading, error }: { data: Record<string, ClauseCardProps[]>; file: string; loading: boolean; error: string | null }) => {
    const [page, setPage] = useState(1)
    const pageSize = 4
    const [ruling, setRuling] = useState(Object.keys(data)[0] ?? 'riba')
    const visibleClauses = useMemo(() => {
        const start = (page - 1) * pageSize
        // console.log(Object.keys(data)[0])
        // console.log('ruling:', ruling)
        // console.log(data[ruling])
        return data[ruling]?.slice(start, start + pageSize) || []
    }, [data, page, ruling])
    const pageCount = Math.ceil((data[ruling]?.length || 0) / pageSize)

    const downloadPDF = (data:any, file:any) => {
        try {
            console.log('building report')
            buildReport({ data, file })
        } catch (err) {
            console.error('Error occurred while generating PDF report:', err)
        }
    }

    return (
        <section className="w-full max-w-[1100px] scroll-mt-20 flex flex-col items-center justify-start">

            <div className="w-full flex items-center justify-between mb-6">
                {Object.keys(data).length > 0 && (
                    <Button disabled={loading} onClick={() => downloadPDF(data, file)} variant="outline" size="sm" className="export-button cursor-pointer">
                        <Download /> Export Report
                    </Button>
                )}
                <div className="rounded-[36px] border-muted-foreground bg-(--background-dark) p-1 w-auto">
                    {Object.keys(data).map((key) => (
                        <button
                            key={key}
                            className={`px-3 py-1 font-medium rounded-[36px] text-sm transform transition cursor-pointer ${ruling === key ? "bg-white text-black" : "text-muted-foreground"}`}
                            onClick={() => {
                                setRuling(key)
                                setPage(1)
                            }}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`w-full h-auto flex flex-col items-center justify-start ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                <h3 className="text-(--accent-color) text-sm font-bold mb-4">Analysis of {file}</h3>
                {error ? (
                    <p className="text-(--non-compliant) text-xs text-center">{error}</p>
                ) : null}
                {visibleClauses.length > 0 ? (<>
                    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                        {visibleClauses?.map((clause) => <ClauseCard {...clause} />)}
                    </div>

                    {pageCount > 1 && (
                        <Pagination className="mt-7">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#seminar-library"
                                        aria-disabled={page === 1}
                                        className={page === 1 ? "pointer-events-none opacity-40" : undefined}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (page > 1) setPage((current) => current - 1);
                                        }}
                                    />
                                </PaginationItem>
                                {Array.from({ length: pageCount }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#seminar-library"
                                                isActive={page === pageNumber}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setPage(pageNumber);
                                                }}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#seminar-library"
                                        aria-disabled={page === pageCount}
                                        className={page === pageCount ? "pointer-events-none opacity-40" : undefined}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (page < pageCount) setPage((current) => current + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                
                </>) :
                
                (
                    <p className="text-center text-muted-foreground text-xs md:text-sm">
                        No clauses relevant to {ruling} found.
                    </p>
                )}
            </div>
            

            

        </section>
    )
}

export default ClauseBreakdown