
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
            confidence: 95,
            ruling: 'riba',
            summary: 'The clause stipulates a fixed excess (Prime Rate + 2.75%) on the loan, i.e., interest charged on the principal, which is a prohibited benefit (riba) under AAOIFI Standard 19.',
            reasoning: 'The contract explicitly states that interest shall accrue daily at a rate above the Prime Rate, compounded monthly. Under AAOIFI Standard 19, any stipulated excess benefit for the lender in a Qard (loan) is prohibited as it amounts to riba, regardless of whether the excess is in quality or quantity (4/1). Consequently, the presence of a defined interest rate makes the loan non‑Shariah compliant.',
            citation: 'AAOIFI Shariah Standard - 19, 4/1',
            suggestion: 'non-compliant',
            chunk: '3. Interest Rate Interest shall accrue daily on the outstanding principal balance at a variable rate equal to the Prime Rate plus 2.75% per annum, compounded monthly. The Prime Rate is determined by the Lender in its discretion by reference to prevailing market conditions and is subject to change without prior notice to the Borrower. The effective annual rate as of the Agreement Date is 8.20%, calculated on the assumption that the Prime Rate remains unchanged. 4. In-Study Period',
            chunkPage: 1
        },
        {
            confidence: 95,
            ruling: 'riba',
            summary: 'The clause imposes interest that accrues and is capitalized into the loan balance, creating an excess repayment over the original principal, which is prohibited as riba.',
            reasoning: 'The passage stipulates that interest will accrue during the study period and be added to the outstanding principal. Under AAOIFI Standard 19, any stipulated excess benefit to the lender—whether in quality or quantity—constitutes riba and is forbidden (4/1). Capitalizing interest creates a higher repayment amount than the original fungible loan, violating the Qard principle that repayment must be of a similar amount only. Hence the contract is non‑compliant.',
            citation: 'AAOIFI Shariah Standard - 19, 4/1',
            suggestion: 'non-compliant',
            chunk: '4. In-Study Period During any period in which the Borrower is enrolled on at least a half-time basis at an accredited institution, the Borrower is not required to make payments of principal. Interest that accrues during such period will not be billed directly to the Borrower but will instead be capitalized — that is, added to the outstanding principal balance — on the last day of each academic term and again at the conclusion of the in-study period. 5. Repayment',
            chunkPage: 1
        },
        {
            confidence: 95,
            ruling: 'riba',
            summary: 'The clause mandates interest to accrue on the loan balance and to be capitalized, and allows additional charges upon default, which constitute an excess benefit over the principal. Such interest and excess charges are prohibited under AAOIFI Standard 19.',
            reasoning: 'The passage explicitly states that interest shall continue to accrue on the full outstanding balance, including capitalized amounts, and that upon default the lender can demand the entire balance including accrued and capitalized interest, plus additional charges. According to AAOIFI Shariah Standard 19, any stipulation of an excess for the lender in a Qard contract—whether in quantity, quality, or as a tangible benefit—is prohibited and amounts to riba (Standard 4/1). The inclusion of accrued interest and extra charges represents a prohibited excess benefit, rendering the contract non‑compliant with the principle of riba.',
            citation: 'AAOIFI Shariah Standard - 19, 4/1',
            suggestion: 'non-compliant',
            chunk: "Interest shall continue to accrue on the full outstanding balance, including any capitalized amounts, throughout any period of delinquency. 8. Default The Borrower shall be in default under this Agreement upon failure to make two (2) consecutive scheduled payments when due. Upon default, the Lender may, without further notice, declare the entire outstanding balance — including accrued and capitalized interest — immediately due and payable. Additional charges may be applied to the Borrower's account as",
            chunkPage: 1
        },
        {
            confidence: 85,
            ruling: 'riba',
            summary: 'The passage outlines a Qard (loan) for tuition and related expenses, disbursed in installments upon proof of enrollment, with a defined draw period. No interest, excess benefit, or prohibited charges are stipulated, aligning with AAOIFI standards that allow a loan contract, a permissible period, and forbid any excess (riba).',
            reasoning: 'The contract uses language consistent with a Qard (loan) for permissible educational purposes, satisfying the requirement of a fungible subject‑matter (cash) and the offer‑acceptance element (3/1). It stipulates a clear draw period, which is allowed under Standard 6. There is no mention of any interest, profit, or excess benefit for the lender, complying with the prohibition on riba (4/1). Since no service charges or additional benefits are described, the contract does not violate the rules on excess benefits or service charges (9/1). Consequently, the passage conforms to the AAOIFI Shariah Standard‑19 criteria for a riba‑free loan.',
            citation: 'AAOIFI Shariah Standard - 19, 3/1; 4/1; 6; 9/1',
            suggestion: 'compliant',
            chunk: "solely for the purpose of funding tuition, mandatory fees, textbooks, and reasonable living expenses associated with the Borrower's program of study. 2. Disbursement Draws will be disbursed in installments aligned with the academic term schedule of the Borrower's institution, upon the Lender's receipt of satisfactory proof of enrollment. The Borrower may request Draws up to the Credit Limit at any time during the Draw Period, being the expected duration of the Borrower's program of study plus one academic term.",
            chunkPage: 1
        }
    ],
    'gharar': [
        {
            confidence: 85,
            ruling: 'gharar',
            summary: 'The clause allowing the Lender to determine amounts based on market conditions and internal policy creates uncertain (excessive) gharar in the primary subject matter (payment amount), which is not justified by any Shariah‑recognizable necessity, rendering the contract non‑compliant.',
            reasoning: "The passage states that amounts are 'determined by the Lender based on then‑current market conditions and the Lender's internal collections policy'. This introduces uncertainty about the exact payment due at the time of contracting, constituting excessive gharar (AAOIFI 31, 4/2/1) because the uncertainty dominates the contract and can lead to dispute. Moreover, the uncertainty relates to the primary subject matter—the price/repayment amount—so it nullifies the contract per AAOIFI 31, 4/3. No Shariah‑recognizable necessity is provided to justify this uncertainty (AAOIFI 31, 4/4). Therefore, the clause violates the Gharar controls for exchange‑based contracts, making the agreement non‑compliant. The pre‑payment clause, while allowing early repayment, also prioritises accrued interest, which further underscores the reliance on an uncertain interest component, but the primary issue is the uncertain determination of amounts by the Lender.",
            citation: 'AAOIFI Shariah Standard - 31, 4/2/1 Excessive Gharar; 4/3 Gharar relating to primary subject matter; 5/2/2 Gharar in price or rent when left to be determined by one party nullifies the contract',
            suggestion: 'non-compliant',
            chunk: "determined by the Lender based on then-current market conditions and the Lender's internal collections policy in effect at the time. 9. Prepayment The Borrower may prepay any portion of the outstanding balance at any time without penalty. Prepayments will be applied first to any accrued and unpaid interest, and thereafter to the outstanding principal balance. 10. Cosigner Release A Cosigner, where applicable, may apply to be released from their obligations under this Agreement after the Borrower has",
            chunkPage: 2
        },
        {
            confidence: 85,
            ruling: 'gharar',
            summary: 'The clause allowing the Lender to change terms at its sole discretion creates excessive uncertainty about the borrower’s obligations, violating the prohibition of excessive gharar in exchange‑based contracts. The late‑payment fee, while specified, functions as a penalty akin to interest and further compounds the non‑compliance.',
            reasoning: "AAOIFI Standard 31 states that gharar is impermissible when it (a) is present in an exchange‑based contract, (b) is excessive, and (c) relates to the primary subject matter of the contract (4/1, 4/2, 4/3). The lender’s unilateral right to modify terms based on market or risk assessments introduces a dominant, uncertain element that can alter the payment amount— the primary object of the loan—making the contract void due to excessive gharar (4/2/1). Additionally, the late‑payment fee, although quantified, operates as a punitive charge for delayed payment, resembling riba, which is also prohibited. Hence the passage fails the gharar controls.",
            citation: 'AAOIFI Shariah Standard - 31, 4/1 First Condition; 4/2 Second Condition (excessive gharar); 4/3 Third Condition (primary subject matter); 7 Impact of Gharar from contract conditions',
            suggestion: 'non-compliant',
            chunk: "its sole discretion, in response to changes in market conditions, regulatory requirements, or the Lender's internal risk assessment of the Borrower. The Lender will endeavour to provide notice of any such change through the Borrower's online account within a commercially reasonable time following the change. 7. Late Payment A scheduled payment not received by the Lender within ten (10) days of its due date shall be considered late. A late payment fee equal to the greater of $35.00 or 5% of the missed payment amount will be applied to the Borrower's account.",
            chunkPage: 2
        },
        {
            confidence: 90,
            ruling: 'gharar',
            summary: 'The clause ties repayment to a variable "Prime Rate" interest, creating uncertainty about the exact amount owed. Under AAOIFI Standard 31, Gharar in price or rent that is not fixed at the time of contract nullifies the agreement, unless the price is determinable at the moment of sale (e.g., market price). A fluctuating interest rate introduces excessive/medium Gharar and also involves riba, rendering the contract non‑Shariah compliant.',
            reasoning: " The passage defines 'Prime Rate' as the annual rate of interest used as a reference for the loan. Because the rate can change over time, the borrower cannot know the precise repayment amount at contract formation, which constitutes Gharar in the price/rent of the contract's object (AAOIFI 31, 5/2). This Gharar is not justified by a Shari'ah‑recognizable necessity and therefore violates condition (b) excessive Gharar and condition (d) lack of necessity. Consequently, the contract is void under the standard. Additionally, the presence of interest (riba) further confirms non‑compliance.",
            citation: "AAOIFI Shariah Standard - 31, 5/2 Gharar in the price or rent of the contract's object",
            suggestion: 'non-compliant',
            chunk: 'and reasonable living expenses in connection with a program of study at an accredited post-secondary institution; and WHEREAS the Lender is willing to extend such credit subject to the terms and conditions set out below; NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows: 1. Definitions and Purpose “Prime Rate” means the annual rate of interest published from time to time by the Lender as its reference lending rate. “Draw” means an amount advanced to the Borrower under this Agreement. This Line of Credit (the “Facility”) is extended',
            chunkPage: 1
        },
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