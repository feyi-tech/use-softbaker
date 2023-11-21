import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SoftBakerProvider } from 'use-softbaker'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SoftBakerProvider siteId="test">
        <Component {...pageProps} />
      </SoftBakerProvider>
    </ChakraProvider>
    
  )
}