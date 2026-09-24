
import { 
    // useMemo, 
    useState 
} from 'react'
import ClauseCard from "../analyze/ClauseCard"
import type {ClauseCardProps} from '../analyze/ClauseCard'
// import { Button } from "../ui/button";

const sampleData: Record<string, ClauseCardProps[]> = {
    'riba': [
        {
            confidence: 80,
            ruling: 'riba',
            summary: 'This is a sample clause for Riba.',
            reasoning: 'The clause violates the prohibition on interest.',
            citation: '',
            suggestion: 'non-compliant',
            chunk: 'Sample chunk of text for the Riba clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'riba',
            summary: 'This is a sample clause for Riba.',
            reasoning: 'The clause violates the prohibition on interest.',
            citation: '',
            suggestion: 'non-compliant',
            chunk: 'Sample chunk of text for the Riba clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'riba',
            summary: 'This is a sample clause for Riba.',
            reasoning: 'The clause violates the prohibition on interest.',
            citation: '',
            suggestion: 'compliant',
            chunk: 'Sample chunk of text for the Riba clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'riba',
            summary: 'This is a sample clause for Riba.',
            reasoning: 'The clause violates the prohibition on interest.',
            citation: '',
            suggestion: 'uncertain',
            chunk: 'Sample chunk of text for the Riba clause.',
            chunkPage: 1
        }
    ],
    'gharar': [
        {
            confidence: 80,
            ruling: 'gharar',
            summary: 'This is a sample clause for Gharar.',
            reasoning: 'The clause violates the prohibition on uncertainty.',
            citation: '',
            suggestion: 'compliant',
            chunk: 'Sample chunk of text for the Gharar clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'gharar',
            summary: 'This is a sample clause for Gharar.',
            reasoning: 'The clause violates the prohibition on uncertainty.',
            citation: '',
            suggestion: 'non-compliant',
            chunk: 'Sample chunk of text for the Gharar clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'gharar',
            summary: 'This is a sample clause for Gharar.',
            reasoning: 'The clause violates the prohibition on uncertainty.',
            citation: '',
            suggestion: 'non-compliant',
            chunk: 'Sample chunk of text for the Gharar clause.',
            chunkPage: 1
        },
        {
            confidence: 80,
            ruling: 'gharar',
            summary: 'This is a sample clause for Gharar.',
            reasoning: 'The clause violates the prohibition on uncertainty.',
            citation: '',
            suggestion: 'uncertain',
            chunk: 'Sample chunk of text for the Gharar clause.',
            chunkPage: 1
        }
    ]
}

const SampleClauseBreakdown = () => {

    const [ruling, setRuling] = useState('riba')

    return (
        <section className="w-full max-w-[1100px] scroll-mt-20 flex flex-col items-center justify-start">

            <div className="w-full flex items-center justify-end mb-6">
                <div className="rounded-[36px] border-muted-foreground bg-(--background-dark) p-1 w-auto">
                    {Object.keys(sampleData).map((key) => (
                        <button
                            key={key}
                            className={`px-3 py-1 font-medium rounded-[36px] text-sm transform transition cursor-pointer ${ruling === key ? "bg-white text-black" : "text-muted-foreground"}`}
                            onClick={() => {
                                setRuling(key)
                            }}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`w-full h-auto flex flex-col items-center justify-start`}>
                <h3 className="text-(--accent-color) text-sm font-medium mb-4 italic">"Analysis of my loan agreement."</h3>
 
                {sampleData[ruling]?.length > 0 && (<>
                    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                        {sampleData[ruling]?.map((clause) => <ClauseCard {...clause} />)}
                    </div>

                </>)}
            </div>
            

            

        </section>
    )
}

export default SampleClauseBreakdown