import '../styles/globals.css'
//import '../common/Loader/Loader.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
