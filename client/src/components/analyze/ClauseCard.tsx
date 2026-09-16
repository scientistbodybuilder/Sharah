import {
  Card,
//   CardAction,
  CardContent,
//   CardDescription,
//   CardFooter,
  CardHeader,
//   CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
//   DialogClose,
  DialogContent,
  DialogDescription,
//   DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CircleCheck, CircleX, SlidersHorizontal } from "lucide-react"

export interface ClauseCardProps {
    confidence: number
    ruling: string
    summary: string
    reasoning: string
    citation?: string
    suggestion: string
    chunk: string
    chunkPage: number
}

function SuggestionIcon (suggestion: string) {
    switch (suggestion) {
        case "non-compliant":
            return {
                icon: <CircleX color="var(--non-compliant)" className="h-4 w-4 m-0" />,
                color: "(--non-compliant)",
                badge: "border-(--non-compliant) bg-(--non-compliant)/30",
                text: "text-(--non-compliant)",
            }
        case "compliant":
            return {
                icon: <CircleCheck color="var(--compliant)" className="h-4 w-4 m-0" />,
                color: "(--compliant)",
                badge: "border-(--compliant) bg-(--compliant)/30",
                text: "text-(--compliant)",
            }
        case "uncertain":
            return {
                icon: <SlidersHorizontal color="var(--uncertain)" className="h-4 w-4 m-0" />,
                color: "(--uncertain)",
                badge: "border-(--uncertain) bg-(--uncertain)/30",
                text: "text-(--uncertain)",
            }
        default:
            return {
                icon: <CircleX color="var(--non-compliant)" className="h-4 w-4 m-0" />,
                color: "(--non-compliant)",
                badge: "border-(--non-compliant) bg-(--non-compliant)/30",
                text: "text-(--non-compliant)",
            }
    }
}

const ClauseCard = ({ confidence, ruling, summary, reasoning, citation, suggestion, chunk, chunkPage }: ClauseCardProps) => {



    return(
        <Card className="h-full min-h-[280px] rounded-sm border-[#e5ddd7] bg-white py-0 shadow-none transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(96,68,24,0.08)]">
            <CardHeader className="flex items-center justify-between w-full border pb-0 pt-5 m-0 border-0">
                <h3 className="text-(--accent-color) text-sm">{ruling.toUpperCase()}</h3>

                <div className={`flex items-center gap-2 justify-center w-auto border rounded-xl ${SuggestionIcon(suggestion).badge} px-2 py-[2px]`}>
                    {SuggestionIcon(suggestion).icon}
                    <p className={`text-xs m-0 ${SuggestionIcon(suggestion).text}`}>{suggestion}</p>
                </div>
                
            </CardHeader>

            <CardContent className="w-full flex flex-col gap-3 justify-start items-center px-2 pb-2">
                <div className="px-2 py-2 w-full border-border rounded-md bg-(--background-dark)/60 border border-[#ccc] flex flex-col items-start justify-start">
                    <h4 className="text-muted-foreground text-xs">Page: {chunkPage}</h4>
                    <p className="text-black text-xs text-left text-italic mt-1">"{chunk}"</p>
                </div>

                <p className="text-muted-foreground text-xs text-left">Summary: {summary}</p>

                <Dialog>
                    <DialogTrigger className="text-(--accent-color) font-medium text-sm cursor-pointer hover:text-underline hover:text-(--accent-color)/80">View Details</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-(--accent-color)">Clause Details</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="space-y-1">
                            <p className="text-muted-foreground text-sm"><span className="text-black font-semibold">Ruling:</span> {ruling.toUpperCase()}</p>
                            <p className={`text-muted-foreground text-sm font-semibold`}><span className="text-black font-semibold">Confidence:</span> {confidence}%</p>
                            <p className="text-muted-foreground text-sm"><span className="text-black font-semibold">Reasoning:</span> {reasoning}</p>
                            <p className="text-muted-foreground text-sm"><span className="text-black font-semibold">Citation:</span> {citation}</p>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </CardContent>

        </Card>
    )
}

export default ClauseCard