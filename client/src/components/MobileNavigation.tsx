import { HashLink } from 'react-router-hash-link'
import { RxHamburgerMenu } from 'react-icons/rx'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from './ui/button'

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden flex items-center justify-center rounded-md p-2 text-(--accent-color) transition hover:text-(--accent-hover) focus-visible:outline-none">
        <RxHamburgerMenu className="h-5 w-5 cursor-pointer" />
        <span className="sr-only">Open navigation menu</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm border-r border-(--accent-color)/10 bg-(--background-color) p-0"
      >
        <SheetHeader className="border-b border-(--accent-color)/10 px-5 pb-4 pt-5">
          <SheetTitle className="text-left text-(--accent-color)">Navigate</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 py-5">
          <SheetClose
                    key={'Home'}
                    render={
                      <HashLink
                        smooth
                        to={'/'}
                        className="block rounded-md px-3 py-2 text-sm text-(--accent-color) transition hover:bg-(--accent-color)/20"
                      >
                        {'Home'}
                      </HashLink>
                    }
                  />

            <SheetClose
                    key={'Analyze'}
                    render={
                      <HashLink
                        smooth
                        to={'/analyze'}
                        className="block rounded-md px-3 py-2 text-sm text-(--accent-color) transition hover:bg-(--accent-color)/20"
                      >
                        {'Analyze'}
                      </HashLink>
                    }
                  />

        </div>
        <div className="mt-auto border-t border-(--accent-color)/10 p-4">
          <Button className="text-white w-full text-sm bg-(--accent-color)/80 rounded-[36px] py-1! px-3! hover:bg-(--accent-color)/70 cursor-pointer">
            Sign In
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
