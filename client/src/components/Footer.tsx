// import { useState } from 'react'
// import { HashLink } from 'react-router-hash-link'

const Footer = () => {
    // const [loading, setLoading] = useState(false);
    // const sendMessage = async (data: any) => {
    //     console.log('Sending message: ',data)
    //     setLoading(true)
    //     try {
    //       setLoading(true)
    //     // const result = await sendMessageContactForm(data)
    //     // if (result.success) {
    //     //     setMessageSentSuccess(true)
    //     // } else {
    //     //     setMessageSentSuccess(false)
    //     // }
    //     // } catch (e) {
    //     // console.error('Failed to send contact message ', e)
    //     // setMessageSentSuccess(false)
    //     } finally {
    //     setLoading(false)
    //     }
    // }
    return(
        <footer className="bg-(--background-dark) border border-t-(--accent-color)/40 py-1 px-3 h-auto min-h-[140px] box-border w-full text-(--accent-color)">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center mb-2">
              <img src='/sharah-logo.png' alt="Sharah Logo" className="h-8 mr-3" />
              <h3 className="brand-name font-heading text-lg font-medium text-(--accent-color)">Sharah <span className="text-xs bg-(--background-dark)">v1.0</span></h3>
            </div>
            <p className="font-body text-xs text-(--accent-color) m-0">
              Copyright © 2026 Sharah.
            </p>
            <p className='font-body text-xs text-(--accent-color) m-0'>All Rights Reserved</p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="font-body text-(--neutral) text-base font-medium lg:text-lg mb-4">NAVIGATION</h3>
            <ul className="space-y-2 text-sm text-(--accent-color)">
              <li>
                <HashLink smooth to="/" className="font-body hover:text-(--accent-hover) transition-colors">Home</HashLink>
              </li>
              <li>
                <HashLink smooth to="/programming" className="font-body hover:text-(--accent-hover) transition-colors">Programming</HashLink>
              </li>
              <li>
                <HashLink smooth to="/team" className="font-body hover:text-(--accent-hover) transition-colors">Team</HashLink>
              </li>
              
            </ul>
          </div> */}

          {/* <form onSubmit={handleSubmit(sendMessage)}>
            <h3 className="text-(--neutral) font-body font-medium text-base lg:text-lg mb-4">CONTACT</h3>
            
            <div className='font-inter grid grid-cols-2 gap-4 w-full'>
              <input {...register("firstName")} type='text' name='firstName' placeholder='First Name' className='font-body border border-(--accent-color) px-3 py-1 text-(--accent-color) text-xs lg:text-sm placeholder:text-(--accent-color) focus:outline-none' />
              <input {...register("lastName")} type='text' name='lastName' placeholder='Last Name' className='font-body border border-(--accent-color) px-3 py-1 text-(--accent-color) text-xs lg:text-sm placeholder:text-(--accent-color) focus:outline-none' />
              <input {...register("email")} type='text' name='email' placeholder='Email' className='font-body border border-(--accent-color) px-3 py-1 text-(--accent-color) text-xs lg:text-sm placeholder:text-(--accent-color) focus:outline-none' />
              <input {...register("phoneNumber")} type='text' name='phoneNumber' placeholder='Phone Number' className='font-body border border-(--accent-color) px-3 py-1 text-(--accent-color) text-xs lg:text-sm placeholder:text-(--accent-color) focus:outline-none' />
            </div>

            <input {...register("message")} type='text' name='message' placeholder='Message' className='font-body w-full border border-(--accent-color) px-3 py-2 font-normal text-(--accent-color) text-xs lg:text-sm mt-4 placeholder:text-(--accent-color) focus:outline-none' />

            <button type='submit' className='flex items-center justify-center bg-(--accent-color) hover:bg-(--accent-hover) text-white py-1 cursor-pointer px-4 rounded-full mt-2 transition-colors'>
              {loading ? <img src='/gray_spinner.svg' className='h-6 w-6' /> : 'Send'}
            </button>
           
          </form> */}

        </div>

        
      </div>
        </footer>
    )
}

export default Footer