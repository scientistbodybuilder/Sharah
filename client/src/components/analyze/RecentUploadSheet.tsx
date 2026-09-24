import {
  Sheet,
//   SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useQueryClient } from "@tanstack/react-query"
import { hashId } from '../../hooks/useAnalyzeFile'
import { useUser } from '@/context'

interface RecentUploadSheetProps {
    // uploadedFiles: string[]
    setResults: (data: any) => void
    setFileName: (fileName: string) => void
}



//receives list of uploaded files 
const RecentUploadSheet  = ({ setResults, setFileName }: RecentUploadSheetProps) => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const getCachedUploadData = (file: string, hash: string) => {
        console.log('A')
        const data = queryClient.getQueryData(['analysis', hash]);
        console.log(`Fetching cached data for ${file}:`, data);
        if (data) {
            console.log(`Cached data found for ${file}:`, data);
            setResults(data);
            setFileName(file);
        }
    }

    const uploadedFiles: Record<string, string>[] = JSON.parse(sessionStorage.getItem('recentUploads') || '[]').filter((k: any) => k.id === hashId(user?.uid || ''));

    return (
        <Sheet>
            <SheetTrigger className="flex items-center justify-center rounded-md text-xs cursor-pointer p-2 text-(--accent-color) transition duration-100 hover:text-(--accent-light) focus-visible:outline-none">
                Recent Uploads
            </SheetTrigger>
            <SheetContent
            side="left"
            className="w-[85vw] max-w-sm border-r border-(--accent-color)/10 bg-(--background-color) py-0 px-4"
            >
                <SheetHeader className="px-0!">
                    <SheetTitle className="text-(--accent-color) m-0! p-0!">Recent Uploads</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-5">
                    {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((item, index) => (
                                    <div onClick={() => getCachedUploadData(item.filename, item.hash)} key={index} className=" px-2 py-2 truncate w-full flex flex-col justify-start items-start rounded-sm text-xs text-(--accent-color) hover:text-(--accent-light) transition duration-100 hover:bg-(--background-dark) cursor-pointer">
                                        <p className="text-muted-foreground">{item.timestamp}</p>
                                        {item.filename}
                                    </div>)
                                
                            //     }
                            // />
                        )
                    ) : (
                        <p className="text-muted-foreground text-xs">
                            No recent uploads found.
                        </p>
                    )}
                       
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default RecentUploadSheet